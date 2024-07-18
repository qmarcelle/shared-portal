import { useLoginStore } from '@/app/login/stores/loginStore';
import { AppProg } from '@/models/app_prog';
import { ComponentDetails } from '@/models/component_details';
import { ESResponse } from '@/models/enterprise/esResponse';
import { logger } from '@/utils/logger';
import { StateCreator } from 'zustand';
import { deleteMfaDevices } from '../actions/deleteMfaDevices';
import { updateMfaDevices } from '../actions/updateMfaDevices';
import { verifyMfaDevices } from '../actions/verifyMfaDevices';
import { errorCodeMessageMap } from '../models/error_code_message_map';
import { MfaDetails } from '../models/mfa_details';
import { MfaDeviceType } from '../models/mfa_device_type';
import { UpdateMfaRequest } from '../models/update_mfa_devices';
import {
  VerifyMfaRequest,
  VerifyMfaResponse,
} from '../models/verify_mfa_devices';
import { SecuritySettingsStore } from './security_settings_store';

/*eslint-disable @typescript-eslint/no-explicit-any*/
export type UpdateMfaDevicesStore = {
  updatedMfaResult?: ComponentDetails<MfaDetails>;
  verifyMfaResult?: ComponentDetails<VerifyMfaResponse>;
  updatePhoneEmail: (
    deviceType: MfaDeviceType,
    value: string,
  ) => UpdateMfaRequest;
  updateMfaDevice: (deviceType: MfaDeviceType, value?: string) => void;
  verifyMfaDevice: (
    deviceType: MfaDeviceType,
    otp: string,
    value?: string,
  ) => Promise<ComponentDetails<VerifyMfaResponse> | undefined>;
  handleVerifyErrors: (error: any) => void;
  deleteMfaDevice: (deviceType: MfaDeviceType, emailOrPhone: string) => void;
  resetState: () => void;
  updateInvalidError: (errors: string[]) => void;
  invalidErrors?: string[];
};

export const createUpdateMfaDevicesStore: StateCreator<
  SecuritySettingsStore,
  [],
  [],
  UpdateMfaDevicesStore
> = (set, get) => ({
  updatedMfaResult: undefined,
  verifyMfaResult: undefined,
  invalidErrors: [],
  updateInvalidError: (errors: string[]) => {
    set({ invalidErrors: errors });
  },
  updatePhoneEmail: (deviceType: MfaDeviceType, value: string) => {
    const request = {} as UpdateMfaRequest;
    if (
      deviceType === MfaDeviceType.text ||
      deviceType === MfaDeviceType.voice
    ) {
      request.phone = `1${value.replace(/\D/g, '')}`;
    }
    if (deviceType === MfaDeviceType.email) {
      request.email = value;
    }
    return request;
  },
  updateMfaDevice: async (deviceType: MfaDeviceType, value?: string) => {
    try {
      let request: UpdateMfaRequest = {
        userId: useLoginStore.getState().username,
        deviceType: deviceType,
      };
      if (value) {
        request = { ...request, ...get().updatePhoneEmail(deviceType, value) };
      }
      const response = await updateMfaDevices(request);
      if (response.errorCode) {
        throw response;
      }
      if (response.data) {
        set({
          updatedMfaResult: {
            result: {
              email: response.data.email,
              phone: response.data.phone,
              secret: response.data.secret,
              keyUri: response.data.keyUri,
            },
            errors: [],
            state: AppProg.success,
          },
        });
        get().loadMfaDevices();
      }
    } catch (err) {
      logger.error('Update Device Failed' + err);
      throw err;
    }
  },
  verifyMfaDevice: async (
    deviceType: MfaDeviceType,
    otp: string,
    value?: string,
  ) => {
    try {
      let request: VerifyMfaRequest = {
        userId: useLoginStore.getState().username,
        deviceType: deviceType,
        OTP: otp,
      };
      if (value) {
        request = { ...request, ...get().updatePhoneEmail(deviceType, value) };
      }
      const response = await verifyMfaDevices(request);
      if (response.errorCode) {
        throw response;
      }
      if (response.data?.deviceStatus === 'ACTIVE') {
        set({
          verifyMfaResult: {
            state: AppProg.success,
            result: response.data,
            errors: [],
          },
        });
        get().loadMfaDevices();
      }
    } catch (err) {
      logger.error('Verify Mfa Failed' + err);
      get().handleVerifyErrors(err);
    }
    return get().verifyMfaResult;
  },
  handleVerifyErrors: (err: any) => {
    try {
      // Handle Axios specific errors
      const errorMessage = errorCodeMessageMap.get(
        (err as ESResponse<VerifyMfaResponse>).errorCode!,
      );
      set({
        verifyMfaResult: {
          state: AppProg.failed,
          result: err,
          errors: errorMessage ? [errorMessage] : [],
        },
      });
    } catch (err) {
      logger.error('handle verify error' + err);
      throw 'Internal Error';
    }
  },
  deleteMfaDevice: async (deviceType: MfaDeviceType, emailOrPhone: string) => {
    try {
      let request: UpdateMfaRequest = {
        deviceType: deviceType,
        userId: useLoginStore.getState().username,
      };
      if (emailOrPhone) {
        request = {
          ...request,
          ...get().updatePhoneEmail(deviceType, emailOrPhone),
        };
      }
      const response = await deleteMfaDevices(request);
      if (response.errorCode) {
        throw response;
      }
      get().loadMfaDevices();
    } catch (err) {
      logger.error('Delete Mfa Devices' + err);
      throw err;
    }
  },
  resetState: () => {
    if (get().verifyMfaResult) {
      set((state) => ({
        ...state,
        verifyMfaResult: undefined,
        updatedMfaResult: undefined,
      }));
    }
  },
});
