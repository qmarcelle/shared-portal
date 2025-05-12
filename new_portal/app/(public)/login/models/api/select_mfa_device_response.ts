import { SelectMfaDeviceRequest } from './select_mfa_device_request';

export type SelectMfaDeviceResponse = {
  flowStatus: string;
} & SelectMfaDeviceRequest;