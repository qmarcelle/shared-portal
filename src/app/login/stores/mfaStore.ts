import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callSelectDevice, callSubmitMfaOtp } from '../actions/mfa';
import { AppProg } from '../models/app/app_prog';
import { inlineErrorCodeMessageMap } from '../models/app/error_code_message_map';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { MfaOption } from '../models/app/mfa_option';
import { SelectMFAStatus, SubmitMFAStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type MfaStore = {
  selectedMfa: MfaOption | null;
  code: string;
  resend: boolean;
  stage: MfaModeState;
  availMfaModes: MfaOption[];
  initMfaProg: AppProg;
  completeMfaProg: AppProg;
  multipleMFASecurityCodeAttempts: boolean;
  updateMfaMode: (mode: MfaOption) => void;
  updateCode: (code: string) => void;
  updateResendCode: (resent: boolean) => void;
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
    resend: false,
    stage: MfaModeState.selection,
    availMfaModes: [],
    initMfaProg: AppProg.init,
    completeMfaProg: AppProg.init,
    multipleMFASecurityCodeAttempts: false,
    updateMfaMode: (mode: MfaOption) =>
      set(() => ({
        selectedMfa: mode,
      })),
    updateCode: (val: string) =>
      set(() => ({
        code: val.trim(),
      })),
    updateResendCode: (val: boolean) =>
      set(() => ({
        resend: val,
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
          get().updateCode('');
          get().updateResendCode(false);
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
          userToken: useLoginStore.getState().userToken,
        });

        if (resp.status == SelectMFAStatus.ERROR) {
          const errorMessage = inlineErrorCodeMessageMap.get(
            resp.error?.errorCode ?? '',
          );
          if (errorMessage != null) {
            useLoginStore.setState({
              apiErrors: [errorMessage],
            });
          } else {
            useLoginStore.setState({ unhandledErrors: true });
          }
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
          userToken: useLoginStore.getState().userToken,
        });

        if (resp.status == SubmitMFAStatus.PASSWORD_RESET_REQUIRED) {
          useLoginStore.setState({
            forcedPasswordReset: true,
          });
          return;
        }

        if (resp.status == SubmitMFAStatus.EMAIL_UNIQUENESS) {
          useLoginStore.setState({
            emailUniqueness: true,
          });
          return;
        }

        if (resp.status == SubmitMFAStatus.OTP_OK) {
          useLoginStore.setState({
            loggedUser: true,
          });
        }

        if (resp.status == SubmitMFAStatus.GENERIC_OR_INLINE_ERROR) {
          const errorMessage = inlineErrorCodeMessageMap.get(
            resp.error?.errorCode ?? '',
          );
          if (errorMessage != null && !get().resend) {
            useLoginStore.setState({
              apiErrors: [errorMessage],
            });
          } else {
            useLoginStore.setState({ unhandledErrors: true });
          }
          set({ completeMfaProg: AppProg.failed });
          return;
        }
        if (resp.status == SubmitMFAStatus.OTP_INVALID_LIMIT_REACHED) {
          set({
            completeMfaProg: AppProg.failed,
            multipleMFASecurityCodeAttempts: true,
          });
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
          resend: true,
        });

        // Start Mfa auth only if we have multiple mfa selection
        if (get().availMfaModes.length > 1) {
          get().startMfaAuth();
        }

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
