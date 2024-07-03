import { MfaDeviceType } from './mfa_device_type';

export interface UpdateMfaRequest {
  userId: string;
  credentials?: string;
  deviceType: MfaDeviceType;
  phone?: string;
  email?: string;
}

export interface UpdateMfaResponse {
  message: string;
  deviceType: MfaDeviceType;
  deviceStatus: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  email: string;
  secret: string;
  keyUri: string;
}
