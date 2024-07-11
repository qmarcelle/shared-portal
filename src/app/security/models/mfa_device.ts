import { MfaDeviceType } from './mfa_device_type';

export interface MfaDevice {
  deviceType: MfaDeviceType;
  enabled: boolean;
  label: string;
  subLabel?: string;
  emailOrPhone: string | null;
  keyUri?: string;
  secret?: string;
}
