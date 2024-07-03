import { MfaDeviceType } from './mfa_device_type';

export interface GetMfaDevices {
  devices: Device[];
}

export interface Device {
  deviceType: MfaDeviceType;
  deviceStatus: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  email: string;
}
