export interface LoginRequest {
  username: string;
  password: string;
  policyId?: string;
  appId?: string;
  deviceProfile?: string;
  ipAddress?: string | null;
  userAgent?: string;
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
  sessionToken?: string;
  interactionId: string;
  interactionToken: string;
  mfaDeviceList?: MfaDeviceListItem[];
  email?: string;
  flowStatus?: string;
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

export interface PortalLoginResponse extends LoginResponse {
  userToken: string;
}
