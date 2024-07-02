export interface LoginRequest {
  username: string;
  password: string;
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
