import { ActionResponse } from '@/models/app/actionResponse';
import { AppProg } from '@/models/app_prog';
import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callVerifyEmailOtp } from '../actions/verifyEmail';
import { PortalLoginResponse } from '../models/api/login';
import { errorCodeMessageMap } from '../models/app/error_code_message_map';
import { LoginStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type VerifyEmailStore = {
  code: string;
  updateCode: (code: string) => void;
  submitVerifyEmailAuth: () => void;
  resetApiErrors: () => void;
  completeVerifyEmailProg: AppProg;
  apiErrors: string[];
};

export const useVerifyEmailStore = createWithEqualityFn<VerifyEmailStore>(
  (set, get) => ({
    code: '',
    apiErrors: [],
    resetApiErrors: () =>
      set(() => ({
        apiErrors: [],
      })),
    completeVerifyEmailProg: AppProg.init,
    updateCode: (val: string) =>
      set(() => ({
        code: val.trim(),
      })),
    submitVerifyEmailAuth: async () => {
      try {
        // Clear existing errors
        set({ apiErrors: [] });
        // Set SubmitMfa prog to loading
        set({
          completeVerifyEmailProg: AppProg.loading,
        });
        const resp = await callVerifyEmailOtp({
          emailOtp: get().code,
          interactionId:
            useLoginStore.getState().interactionData!.interactionId,
          interactionToken:
            useLoginStore.getState().interactionData!.interactionToken,
          username: useLoginStore.getState().username,
        });

        switch (resp.status) {
          case LoginStatus.ERROR:
            throw resp;
          case LoginStatus.LOGIN_OK:
            useLoginStore.getState().updateLoggedUser(true);
            break;
          case LoginStatus.ACCOUNT_INACTIVE:
            useLoginStore.getState().updateMultipleLoginAttempts(true);
            set({
              completeVerifyEmailProg: AppProg.failed,
            });
            return;
        }
        // Process login response for further operations
        await useLoginStore.getState().processLogin(resp.data!);
        set({
          completeVerifyEmailProg: AppProg.success,
        });
      } catch (err) {
        logger.error('Error from Verify Email Api', err);
        console.error(err);
        // Set indicator for login button
        set(() => ({ completeVerifyEmailProg: AppProg.failed }));
        const errorMessage = errorCodeMessageMap.get(
          (err as ActionResponse<LoginStatus, PortalLoginResponse>)?.error
            ?.errorCode ?? '',
        );
        if (errorMessage != null) {
          set((state) => ({
            apiErrors: [...state.apiErrors, errorMessage],
          }));
        } else {
          useLoginStore.setState({ unhandledErrors: true });
        }
      }
    },
  }),
  shallow,
);
