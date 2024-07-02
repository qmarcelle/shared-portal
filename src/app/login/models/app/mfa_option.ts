import { MfaDeviceMetadata } from './mfa_device_metadata';
import { MfaMode } from './mfa_mode';

export interface MfaOption {
  id: string;
  type: MfaMode;
  metadata?: MfaDeviceMetadata;
}
