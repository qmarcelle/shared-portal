import { NextErrorResp } from '@/models/app/nextErrorResp';
import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callLogin } from '../actions/login';
import { LoginResponse } from '../models/api/login';
import { AppProg } from '../models/app/app_prog';
import { errorCodeMessageMap } from '../models/app/error_code_message_map';
import { LoginInteractionData } from '../models/app/login_interaction_data';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { MfaOption } from '../models/app/mfa_option';
import {
  mapMfaDeviceMetadata,
  mapMfaDeviceType,
} from '../utils/mfaDeviceMapper';
import { useMfaStore } from './mfaStore';

export type LoginStore = {
  username: string;
  password: string;
  loggedUser: boolean;
  unhandledErrors: boolean;
  mfaNeeded: boolean;
  updateUsername: (val: string) => void;
  updatePassword: (val: string) => void;
  login: () => Promise<void>;
  processLogin: (response: LoginResponse) => Promise<void>;
  resetApiErrors: () => void;
  resetToHome: () => void;
  loginProg: AppProg;
  apiErrors: string[];
  apiErrorcode: string[];
  interactionData: LoginInteractionData | null;
};

export const useLoginStore = createWithEqualityFn<LoginStore>(
  (set, get) => ({
    username: '',
    password: '',
    loggedUser: false,
    unhandledErrors: false,
    mfaNeeded: false,
    updateUsername: (val: string) =>
      set(() => ({
        username: val.trim(),
      })),
    updatePassword: (val: string) =>
      set(() => ({
        password: val.trim(),
      })),
    login: async () => {
      try {
        // Set the errors to empty
        set(() => ({ apiErrors: [] }));
        // Set loading indicator
        set(() => ({ loginProg: AppProg.loading }));
        const resp = await callLogin({
          username: get().username, //get().userName,
          password: get().password, //get().password,
        });

        if (resp.errorCode) {
          throw resp;
        }

        // Set to success if request succeeded
        set(() => ({ loginProg: AppProg.success }));
        // Process login response for further operations
        await get().processLogin(resp.data!);
      } catch (err) {
        // Log the error
        logger.error('Error from Login Api', err);
        console.error(err);
        // Set indicator for login button
        set(() => ({ loginProg: AppProg.failed }));
        const errorMessage = errorCodeMessageMap.get(
          (err as NextErrorResp).errorCode!,
        );
        if (errorMessage != null) {
          set((state) => ({
            apiErrors: [...state.apiErrors, errorMessage],
          }));
        } else {
          set(() => ({ unhandledErrors: true }));
        }
      }
    },
    processLogin: async (data: LoginResponse) => {
      // Set the interaction data for upcoming requests
      set({
        interactionData: {
          interactionId: data.interactionId,
          interactionToken: data.interactionToken,
        },
      });

      // Set the User data and exit if no mfa devices are configured
      if (data.mfaDeviceList.length == 0) {
        set({
          loggedUser: true,
        });
        return;
      }

      // Map the avail mfa devices data from api to App Model
      const availMfaDevices: MfaOption[] = data.mfaDeviceList.map((item) => {
        const deviceType = mapMfaDeviceType(item.deviceType);
        return {
          id: item.deviceId,
          type: deviceType,
          metadata: mapMfaDeviceMetadata(item, deviceType),
        };
      });

      // Update avail mfa devices in mfa store
      useMfaStore.getState().updateAvailableMfa(availMfaDevices);
      useMfaStore.getState().updateMfaMode(availMfaDevices[0]);

      // If there is only one mfa device, go to code entry screen
      if (availMfaDevices.length == 1) {
        useMfaStore.getState().updateMfaStage(MfaModeState.code);
      }
      set({ mfaNeeded: true });
    },
    resetToHome: () => {
      set({ mfaNeeded: false, unhandledErrors: false, apiErrors: [] });
      useMfaStore.setState({ stage: MfaModeState.selection });
    },
    resetApiErrors: () =>
      set(() => ({
        apiErrors: [],
      })),
    loginProg: AppProg.init,
    apiErrors: [],
    apiErrorcode: [],
    interactionData: null,
  }),
  shallow,
);
