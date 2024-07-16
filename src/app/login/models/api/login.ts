export interface LoginRequest {
  username: string;
  password: string;
}

export enum LoginMessage {
  COMPLETED,
  OTP_REQUIRED,
  NO_DEVICES_EMAIL_VERIFICATION_REQUIRED,
}

export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  interactionId: string;
  interactionToken: string;
  mfaDeviceList: MfaDeviceListItem[];
}

export interface MfaDeviceListItem {
  deviceType: string;
  deviceStatus: string;
  deviceId: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email?: string;
}
