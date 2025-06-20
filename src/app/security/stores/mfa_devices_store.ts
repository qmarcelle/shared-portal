import { getMfaDevices } from '@/app/security/actions/getMfaDevices';
import { GetMfaDevices } from '@/app/security/models/get_mfa_devices';
import { MfaDevice } from '@/app/security/models/mfa_device';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { SecuritySettingsStore } from '@/app/security/stores/security_settings_store';
import { ESResponse } from '@/models/enterprise/esResponse';
import { formatPhoneNumber } from '@/utils/inputValidator';
import { logger } from '@/utils/logger';
import { StateCreator } from 'zustand';

export type MfaDevicesStore = {
  loadMfaDevices: () => void;
  mfaDevices: Map<MfaDeviceType, MfaDevice>;
  defaultMfaDevices: Map<MfaDeviceType, MfaDevice>;
  getDeviceError: boolean;
  mfaDevicesEnabled: boolean | undefined;
};

export const createMfaDevicesStore: StateCreator<
  SecuritySettingsStore,
  [],
  [],
  MfaDevicesStore
> = (set, get) => ({
  getDeviceError: false,
  mfaDevicesEnabled: undefined,
  mfaDevices: new Map([
    [
      MfaDeviceType.authenticator,
      {
        deviceType: MfaDeviceType.authenticator,
        emailOrPhone: null,
        enabled: false,
        label: 'Authenticator App',
        // eslint-disable-next-line quotes
        subLabel: "Use your authenticator app's security code.",
      },
    ],
    [
      MfaDeviceType.email,
      {
        deviceType: MfaDeviceType.email,
        emailOrPhone: null,
        enabled: false,
        label: 'Email Message',
      },
    ],
    [
      MfaDeviceType.text,
      {
        deviceType: MfaDeviceType.text,
        emailOrPhone: null,
        enabled: false,
        label: 'Text Message',
      },
    ],
    [
      MfaDeviceType.voice,
      {
        deviceType: MfaDeviceType.voice,
        emailOrPhone: null,
        enabled: false,
        label: 'Voice Call',
      },
    ],
  ]),
  defaultMfaDevices: new Map([
    [
      MfaDeviceType.authenticator,
      {
        deviceType: MfaDeviceType.authenticator,
        emailOrPhone: null,
        enabled: false,
        label: 'Authenticator App',
        // eslint-disable-next-line quotes
        subLabel: "Use your authenticator app's security code",
      },
    ],
    [
      MfaDeviceType.email,
      {
        deviceType: MfaDeviceType.email,
        emailOrPhone: null,
        enabled: false,
        label: 'Email Message',
      },
    ],
    [
      MfaDeviceType.text,
      {
        deviceType: MfaDeviceType.text,
        emailOrPhone: null,
        enabled: false,
        label: 'Text Message',
      },
    ],
    [
      MfaDeviceType.voice,
      {
        deviceType: MfaDeviceType.voice,
        emailOrPhone: null,
        enabled: false,
        label: 'Voice Call',
      },
    ],
  ]),
  loadMfaDevices: async () => {
    // default MFA devices are displayed and respective state is set for the device
    try {
      set({
        getDeviceError: false,
      });
      const resp: ESResponse<GetMfaDevices> = await getMfaDevices();
      set((state) => ({
        mfaDevices: new Map(
          JSON.parse(JSON.stringify([...state.defaultMfaDevices])),
        ),
      }));
      if (!resp.data) throw resp;
      if (resp.data && resp.data.mfaEnabled == 'true') {
        resp.data.devices?.forEach((item) => {
          const mfa = get().mfaDevices.get(
            item.deviceType.toLocaleLowerCase() as MfaDeviceType,
          );
          if (mfa) {
            mfa.enabled = item.deviceStatus == 'ACTIVE' ? true : false;
            if (mfa.deviceType == MfaDeviceType.email) {
              mfa.emailOrPhone = item.email;
            } else if (!(mfa.deviceType == MfaDeviceType.authenticator)) {
              mfa.emailOrPhone = formatPhoneNumber(item.phone.substring(1, 11));
            }
          }
        });
        set((state) => ({
          mfaDevicesEnabled: true,
          mfaDevices: new Map([...state.mfaDevices]),
        }));
      } else {
        set({
          mfaDevicesEnabled: false,
        });
      }
    } catch (err) {
      set({
        getDeviceError: true,
        mfaDevicesEnabled: false,
      });
      logger.error('Loading Mfa Devices failed', err);
    }
  },
});
