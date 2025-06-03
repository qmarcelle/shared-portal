import { ActionResponse } from '@/models/app/actionResponse';
import { AppProg } from '@/models/app_prog';
import { logger } from '@/utils/logger';
import { FormEvent } from 'react';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { getEmailUniquenessResendCode } from '../actions/emailUniquenessResendOtp';
import { callVerifyEmailOtp } from '../actions/verifyEmail';
import { EmailUniquenessResendCodeStatus } from '../models/api/email_uniqueness_resendcode_request';
import { PortalLoginResponse } from '../models/api/login';
import { inlineErrorCodeMessageMap } from '../models/app/error_code_message_map';
import { LoginStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type VerifyEmailStore = {
  code: string;
  updateCode: (code: string) => void;
  submitVerifyEmailAuth: (e?: FormEvent<HTMLFormElement>) => void;
  resetApiErrors: () => void;
  completeVerifyEmailProg: AppProg;
  apiErrors: string[];
  handleResendCode: () => Promise<void>;
  isResentSuccessCode: boolean;
};

export const useVerifyEmailStore = createWithEqualityFn<VerifyEmailStore>(
  (set, get) => ({
    code: '',
    apiErrors: [],
    resetApiErrors: () =>
      set(() => ({
        apiErrors: [],
      })),
    isApiError: false,
    isResentSuccessCode: false,
    completeVerifyEmailProg: AppProg.init,
    updateCode: (val: string) =>
      set(() => ({
        code: val.trim(),
      })),
    submitVerifyEmailAuth: async (e?: FormEvent<HTMLFormElement>) => {
      try {
        e?.preventDefault();
        // Clear existing errors
        set({ apiErrors: [] });
        // Set SubmitMfa prog to loading
        set({
          completeVerifyEmailProg: AppProg.loading,
        });
        const resp = await callVerifyEmailOtp(
          {
            emailOtp: get().code,
            interactionId:
              useLoginStore.getState().interactionData!.interactionId,
            interactionToken:
              useLoginStore.getState().interactionData!.interactionToken,
            username: useLoginStore.getState().username,
          },
          useLoginStore.getState().verifyUniqueEmail
            ? 'verifyUniqueEmailOtp'
            : 'verifyEmailOtp',
        );

        switch (resp.status) {
          case LoginStatus.ERROR:
            throw resp;
          case LoginStatus.LOGIN_OK:
            useLoginStore.getState().updateLoggedUser(true);
            break;
        }
        useLoginStore.setState({
          verifyEmail: false,
          verifyUniqueEmail: false,
        });
        set({
          completeVerifyEmailProg: AppProg.success,
        });
        if (resp.status == LoginStatus.DUPLICATE_ACCOUNT) {
          useLoginStore.setState({
            duplicateAccount: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
              sessionToken: resp.data?.sessionToken ?? '',
            },
            userId: resp.data?.userId ?? '',
          });
          return;
        }
        if (resp.status == LoginStatus.PASSWORD_RESET_REQUIRED) {
          useLoginStore.setState({
            forcedPasswordReset: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
          });
          return;
        }
        if (resp.status == LoginStatus.EMAIL_UNIQUENESS) {
          useLoginStore.setState({
            emailUniqueness: true,
            interactionData: {
              interactionId: resp.data!.interactionId,
              interactionToken: resp.data!.interactionToken,
            },
          });
          return;
        }
        // Process login response for further operations
        await useLoginStore.getState().processLogin(resp.data!);
      } catch (err) {
        logger.error('Error from Verify Email Api', err);
        // Set indicator for login button
        set(() => ({ completeVerifyEmailProg: AppProg.failed }));
        const errorMessage = inlineErrorCodeMessageMap.get(
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
    handleResendCode: async () => {
      try {
        const resp = await getEmailUniquenessResendCode({
          interactionId:
            useLoginStore.getState().interactionData?.interactionId ?? '',
          interactionToken:
            useLoginStore.getState().interactionData?.interactionToken ?? '',
        });
        switch (resp.status) {
          case EmailUniquenessResendCodeStatus.RESEND_OTP:
            set(() => ({ isResentSuccessCode: true }));
            break;

          default:
            throw resp;
        }
      } catch (err) {
        logger.error('Error from resend OTP', err);
        useLoginStore.setState({ unhandledErrors: true });
      }
    },
  }),
  shallow,
);
