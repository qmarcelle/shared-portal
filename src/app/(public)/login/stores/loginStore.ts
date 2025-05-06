import { callLogin } from '@/app/(public)/login/actions/login';
import { callSignOut } from '@/app/(public)/login/actions/signOut';
import { PortalLoginResponse } from '@/app/(public)/login/models/api/login';
import { UpdateEmailResponse } from '@/app/(public)/login/models/api/update_email_response';
import { AppProg } from '@/app/(public)/login/models/app/app_prog';
import {
  inlineErrorCodeMessageMap,
  pingErrorCodes,
  slideErrorCodes,
} from '@/app/(public)/login/models/app/error_code_message_map';
import { getPingOneData } from '@/app/(system)/pingOne/setupPingOne';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { LoginInteractionData } from '../models/app/login_interaction_data';
import { MfaModeState } from '../models/app/mfa_mode_state';
import { MfaOption } from '../models/app/mfa_option';
import { EmailUniquenessStatus, LoginStatus } from '../models/status';
import {
  mapMfaDeviceMetadata,
  mapMfaDeviceType,
} from '../utils/mfaDeviceMapper';
import { useEmailUniquenessStore } from './emailUniquenessStore';
import { useMfaStore } from './mfaStore';
import { usePasswordResetStore } from './passwordResetStore';
import { useVerifyEmailStore } from './verifyEmailStore';

export type LoginStore = {
  username: string;
  password: string;
  loggedUser: boolean;
  unhandledErrors: boolean;
  multipleLoginAttempts: boolean;
  isRiskScoreHigh: boolean;
  riskLevelNotDetermined: boolean;
  verifyEmail: boolean;
  verifyUniqueEmail: boolean;
  emailUniqueness: boolean;
  mfaNeeded: boolean;
  inactive: boolean;
  updateUsername: (val: string) => void;
  updatePassword: (val: string) => void;
  updateMultipleLoginAttempts: (val: boolean) => void;
  login: () => Promise<void>;
  processLogin: (response: PortalLoginResponse) => Promise<void>;
  resetApiErrors: () => void;
  resetToHome: () => void;
  signOut: () => void;
  updateLoggedUser: (val: boolean) => void;
  setVerifyUniqueEmail: (
    val: ActionResponse<EmailUniquenessStatus, UpdateEmailResponse>,
  ) => void;
  loginProg: AppProg;
  apiErrors: string[];
  apiErrorcode: string[];
  interactionData: LoginInteractionData | null;
  userToken: string;
  emailId: string;
  forcedPasswordReset: boolean;
  duplicateAccount: boolean;
  userId: string;
};

export const useLoginStore = createWithEqualityFn<LoginStore>(
  (set, get) => ({
    username: '',
    password: '',
    loggedUser: false,
    unhandledErrors: false,
    multipleLoginAttempts: false,
    isRiskScoreHigh: false,
    riskLevelNotDetermined: false,
    mfaNeeded: false,
    userToken: '',
    verifyEmail: false,
    verifyUniqueEmail: false,
    emailUniqueness: false,
    forcedPasswordReset: false,
    inactive: false,
    emailId: '',
    userId: '',
    duplicateAccount: false,
    updateLoggedUser: (val: boolean) => set(() => ({ loggedUser: val })),
    updateMultipleLoginAttempts: (val: boolean) =>
      set(() => ({ multipleLoginAttempts: val })),
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
        const pingOneData = await getPingOneData();
        // Set the errors to empty
        set(() => ({ apiErrors: [] }));
        // Set loading indicator
        set(() => ({ loginProg: AppProg.loading }));
        const resp = await callLogin({
          username: get().username, //get().userName,
          password: get().password, //get().password,
          deviceProfile: pingOneData, //ping one device profile
        });

        if (resp.status == LoginStatus.LOGIN_OK) {
          set({
            loggedUser: true,
          });
        }

        if (
          resp.status == LoginStatus.ERROR ||
          resp.status == LoginStatus.INVALID_CREDENTIALS
        ) {
          throw resp;
        }
        // Set to success if request succeeded
        set(() => ({ loginProg: AppProg.success }));
        if (resp.status == LoginStatus.VERIFY_EMAIL) {
          set({
            verifyEmail: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
            emailId: resp.data?.email ?? '',
          });
          return;
        }

        if (resp.status == LoginStatus.REACTIVATION_REQUIRED) {
          set({
            verifyEmail: true,
            inactive: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
            emailId: resp.data?.email ?? '',
          });
          return;
        }

        if (resp.status == LoginStatus.EMAIL_UNIQUENESS) {
          set({
            emailUniqueness: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
          });
          return;
        }

        if (resp.status == LoginStatus.PASSWORD_RESET_REQUIRED) {
          set({
            forcedPasswordReset: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
          });
          return;
        }
        if (resp.status == LoginStatus.DUPLICATE_ACCOUNT) {
          set({
            duplicateAccount: true,
            interactionData: {
              interactionId: resp.data?.interactionId ?? '',
              interactionToken: resp.data?.interactionToken ?? '',
            },
            userId: resp.data?.userId ?? '',
          });
          return;
        }

        // Process login response for further operations
        await get().processLogin(resp.data!);
      } catch (err) {
        // Log the error
        logger.error('Error from Login Api', err);
        const errorCode =
          (err as ActionResponse<LoginStatus, PortalLoginResponse>).error
            ?.errorCode ?? '';
        // Set indicator for login button
        set(() => ({ loginProg: AppProg.failed }));
        const errorMessage = inlineErrorCodeMessageMap.get(
          (err as ActionResponse<LoginStatus, PortalLoginResponse>)?.error
            ?.errorCode ?? '',
        );
        if (errorMessage != null) {
          set((state) => ({
            apiErrors: [...state.apiErrors, errorMessage],
          }));
        } else if (slideErrorCodes.includes(errorCode)) {
          if (errorCode == 'UI-405') {
            set({
              multipleLoginAttempts: true,
              loginProg: AppProg.failed,
            });
          }
        } else if (pingErrorCodes.includes(errorCode)) {
          if (errorCode == 'PP-600') {
            set({
              isRiskScoreHigh: true,
            });
            return;
          } else if (errorCode == 'PP-601') {
            set({
              riskLevelNotDetermined: true,
            });
            return;
          }
        } else {
          set(() => ({ unhandledErrors: true }));
        }
      }
    },
    processLogin: async (data: PortalLoginResponse) => {
      // Set the interaction data for upcoming requests
      set({
        interactionData: {
          interactionId: data.interactionId,
          interactionToken: data.interactionToken,
        },
        userToken: data.userToken,
      });

      // Set the User data and exit if no mfa devices are configured
      if (data.mfaDeviceList?.length == 0) {
        set({
          loggedUser: true,
        });
        return;
      }

      // Map the avail mfa devices data from api to App Model
      const availMfaDevices: MfaOption[] = (data.mfaDeviceList || []).map(
        (item) => {
          const deviceType = mapMfaDeviceType(item.deviceType);
          return {
            id: item.deviceId,
            type: deviceType,
            metadata: mapMfaDeviceMetadata(item, deviceType),
          };
        },
      );

      if (availMfaDevices.length > 0) {
        // Update avail mfa devices in mfa store
        useMfaStore.getState().updateAvailableMfa(availMfaDevices);
        useMfaStore.getState().updateMfaMode(availMfaDevices[0]);

        // If there is only one mfa device, go to code entry screen
        if (availMfaDevices.length == 1) {
          useMfaStore.getState().updateMfaStage(MfaModeState.code);
        }
        set({ mfaNeeded: true });
      }
    },
    resetToHome: () => {
      set({
        mfaNeeded: false,
        unhandledErrors: false,
        apiErrors: [],
        username: '',
        password: '',
        multipleLoginAttempts: false,
        verifyEmail: false,
        forcedPasswordReset: false,
        emailUniqueness: false,
        verifyUniqueEmail: false,
        duplicateAccount: false,
      });
      useMfaStore.setState({
        stage: MfaModeState.selection,
        completeMfaProg: AppProg.init,
      });
      useMfaStore.getState().updateCode('');
      useMfaStore.getState().updateResendCode(false);
      useVerifyEmailStore.getState().updateCode('');
      useVerifyEmailStore.getState().resetApiErrors();
      usePasswordResetStore.getState().updatePassword('');
      usePasswordResetStore.getState().updateDOB('');
      usePasswordResetStore.getState().resetError();
      useEmailUniquenessStore.getState().updateEmailAddress('');
      useEmailUniquenessStore.getState().updateConfirmEmailAddress('');
      useEmailUniquenessStore.getState().resetError();
    },
    resetApiErrors: () =>
      set(() => ({
        apiErrors: [],
      })),
    loginProg: AppProg.init,
    apiErrors: [],
    apiErrorcode: [],
    interactionData: null,
    setVerifyUniqueEmail: (
      resp: ActionResponse<EmailUniquenessStatus, UpdateEmailResponse>,
    ) => {
      set({
        verifyUniqueEmail: true,
        interactionData: {
          interactionId: resp.data?.interactionId ?? '',
          interactionToken: resp.data?.interactionToken ?? '',
        },
        emailId: resp.data?.emailId ?? '',
      });
    },
    signOut: async () => {
      try {
        await callSignOut();
        set({
          loggedUser: false,
        });
        get().resetToHome();
        return;
      } catch (error) {
        // Log the error
        logger.error('Error from SignOut Action', error);
      }
    },
  }),
  shallow,
);
