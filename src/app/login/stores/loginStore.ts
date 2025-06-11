import { getPingOneData } from '@/app/pingOne/setupPingOne';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callLogin } from '../actions/login';
import { callSignOut } from '../actions/signOut';
import { PortalLoginResponse } from '../models/api/login';
import { UpdateEmailResponse } from '../models/api/update_email_response';
import { AppProg } from '../models/app/app_prog';
import {
  internalErrorMessageMap,
  pingErrorCodes,
  slideErrorCodes,
} from '../models/app/error_code_message_map';
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
  idleTimedOut: boolean;
  updateUsername: (val: string) => void;
  updatePassword: (val: string) => void;
  updateMultipleLoginAttempts: (val: boolean) => void;
  login: () => Promise<void>;
  processLogin: (response: PortalLoginResponse) => Promise<void>;
  resetApiErrors: () => void;
  resetToHome: () => void;
  signOut: () => Promise<void>;
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
    idleTimedOut: false,
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
              sessionToken: resp.data?.sessionToken ?? '',
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

        // Set indicator for login button
        set(() => ({ loginProg: AppProg.failed }));

        // Handle ActionResponse errors from server (not direct HTTP errors)
        const errorCode =
          (err as ActionResponse<LoginStatus, PortalLoginResponse>)?.error
            ?.errorCode ?? '';
        const internalErrorMessage = internalErrorMessageMap.get(errorCode);

        if (internalErrorMessage) {
          set((state) => ({
            apiErrors: [...state.apiErrors, internalErrorMessage],
          }));
        } else if (slideErrorCodes.includes(errorCode)) {
          if (errorCode === 'UI-405') {
            set({
              multipleLoginAttempts: true,
            });
          }
        } else if (pingErrorCodes.includes(errorCode)) {
          if (errorCode === 'PP-600') {
            set({
              isRiskScoreHigh: true,
            });
          } else if (errorCode === 'PP-601') {
            set({
              riskLevelNotDetermined: true,
            });
          }
        } else {
          // For any unhandled errors, set the generic error flag
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
