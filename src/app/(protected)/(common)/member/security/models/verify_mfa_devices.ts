import { UpdateMfaRequest } from './update_mfa_devices';

export interface VerifyMfaRequest extends UpdateMfaRequest {
  OTP: string;
}

export interface VerifyMfaResponse {
  deviceStatus: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  email: string;
}
