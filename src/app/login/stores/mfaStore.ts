import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callSelectDevice, callSubmitMfaOtp } from '../actions/mfa';
import { AppProg } from '../models/app/app_prog';
import {
  errorCodeMessageMap,
  UNDEFINED_ERROR_CODE,
} from '../models/app/error_code_message_map';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { MfaOption } from '../models/app/mfa_option';
import { SelectMFAStatus, SubmitMFAStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type MfaStore = {
  selectedMfa: MfaOption | null;
  code: string;
  stage: MfaModeState;
  availMfaModes: MfaOption[];
  initMfaProg: AppProg;
  completeMfaProg: AppProg;
  updateMfaMode: (mode: MfaOption) => void;
  updateCode: (code: string) => void;
  updateAvailableMfa: (mfaModes: MfaOption[]) => void;
  updateMfaStage: (mfaModeStage: MfaModeState) => void;
  startMfaAuth: () => void;
  submitMfaAuth: () => void;
  resendMfa: () => void;
};

export const useMfaStore = createWithEqualityFn<MfaStore>(
  (set, get) => ({
    selectedMfa: null,
    code: '',
    stage: MfaModeState.selection,
    availMfaModes: [],
    initMfaProg: AppProg.init,
    completeMfaProg: AppProg.init,
    updateMfaMode: (mode: MfaOption) =>
      set(() => ({
        selectedMfa: mode,
      })),
    updateCode: (val: string) =>
      set(() => ({
        code: val.trim(),
      })),
    updateAvailableMfa: (mfaModes: MfaOption[]) =>
      set(() => ({
        availMfaModes: mfaModes,
      })),
    updateMfaStage: (stage: MfaModeState) =>
      set((state) => {
        if (
          stage == MfaModeState.selection &&
          state.stage == MfaModeState.code
        ) {
          const login = useLoginStore.getState().login;
          login();
        }
        return {
          stage: stage,
        };
      }),
    startMfaAuth: async () => {
      try {
        useLoginStore.setState({ apiErrors: [] });
        // Set Init Mfa to loading
        set({ initMfaProg: AppProg.loading });

        // Call Select Device Api
        const resp = await callSelectDevice({
          deviceId: get().selectedMfa!.id,
          interactionId:
            useLoginStore.getState().interactionData!.interactionId,
          interactionToken:
            useLoginStore.getState().interactionData!.interactionToken,
        });

        if (resp.status == SelectMFAStatus.ERROR) {
          useLoginStore.setState({
            apiErrors: [
              errorCodeMessageMap.get(
                resp.error?.errorCode || UNDEFINED_ERROR_CODE,
              )!,
            ],
          });
          set({ initMfaProg: AppProg.failed });
          return;
        }

        // Update Interaction Data
        useLoginStore.setState({
          interactionData: {
            interactionId: resp.data!.interactionId,
            interactionToken: resp.data!.interactionToken,
          },
        });

        // Mark Init Mfa to Success
        set({
          initMfaProg: AppProg.success,
        });

        // Change Mfa Stage to Code
        set({
          stage: MfaModeState.code,
        });
      } catch (err) {
        logger.error('Error from select device', err);
        set({
          initMfaProg: AppProg.failed,
        });
        useLoginStore.setState({ unhandledErrors: true });
      }
    },
    submitMfaAuth: async () => {
      try {
        // Clear existing errors
        useLoginStore.setState({ apiErrors: [] });
        // Set SubmitMfa prog to loading
        set({
          completeMfaProg: AppProg.loading,
        });

        // Call submitMfaOtp api
        const resp = await callSubmitMfaOtp({
          otp: get().code,
          interactionId:
            useLoginStore.getState().interactionData!.interactionId,
          interactionToken:
            useLoginStore.getState().interactionData!.interactionToken,
        });

        if (resp.status == SubmitMFAStatus.ERROR) {
          useLoginStore.setState({
            apiErrors: [
              errorCodeMessageMap.get(
                resp.error?.errorCode || UNDEFINED_ERROR_CODE,
              )!,
            ],
          });
          set({ completeMfaProg: AppProg.failed });
          return;
        }

        // Update interaction data
        useLoginStore.setState({
          interactionData: {
            interactionId: resp.data!.interactionId,
            interactionToken: resp.data!.interactionToken,
          },
        });

        // Set logged user
        useLoginStore.setState({ loggedUser: true });

        // Set complete mfa prog to successful
        set({ completeMfaProg: AppProg.success });
      } catch (err) {
        logger.error('Error from Submit Mfa', err);
        set({ completeMfaProg: AppProg.failed });
        useLoginStore.setState({ unhandledErrors: true });
      }
    },
    resendMfa: async () => {
      try {
        // Get the prev selected Mfa
        const prevSelectedMfa = get().selectedMfa;

        // Start Login
        await useLoginStore.getState().login();

        // Update the Mfa with prev selected mode, finding the correct device
        set({
          selectedMfa: prevSelectedMfa,
        });

        // Start Mfa auth
        get().startMfaAuth();

        // Set prog to successful
        set({ initMfaProg: AppProg.success });
        useLoginStore.setState({ apiErrors: [] });
      } catch (err) {
        logger.error('Error from Resend call', err);
        set({ initMfaProg: AppProg.failed });
      }
    },
  }),
  shallow,
);
