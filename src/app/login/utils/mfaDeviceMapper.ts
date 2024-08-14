import { maskPhoneNumber, maskEmail } from '@/utils/mask_utils';
import { MfaDeviceMetadata } from '../models/app/mfa_device_metadata';
import { MfaMode } from '../models/app/mfa_mode';
import { MfaDeviceListItem } from '../models/api/login';

const mfaDeviceMap: Record<string, MfaMode> = {
  TOTP: MfaMode.authenticator,
  SMS: MfaMode.textNum,
  VOICE: MfaMode.callNum,
  EMAIL: MfaMode.email,
};

export const mapMfaDeviceType = (type: string) => {
  return mfaDeviceMap[type];
};

export const mapMfaDeviceMetadata = (
  mfaDevice: MfaDeviceListItem,
  type: MfaMode,
): MfaDeviceMetadata => {
  let device: string;
  switch (type) {
    case MfaMode.authenticator:
      return {
        selectionText: 'Use an Authenticator App',
        device: 'Authenticator App',
      };
    case MfaMode.textNum:
      device = maskPhoneNumber(mfaDevice.phone!);
      return {
        selectionText: `Text a code to ${device}`,
        device,
      };
    case MfaMode.callNum:
      device = maskPhoneNumber(mfaDevice.phone!);
      return {
        selectionText: `Call with a code to ${device}`,
        device,
      };
    case MfaMode.email:
      device = maskEmail(mfaDevice.email!);
      return {
        selectionText: `Email a code to ${maskEmail(mfaDevice.email!)}`,
        device,
      };
  }
};
