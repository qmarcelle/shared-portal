import { ESResponse } from '@/models/enterprise/esResponse';
import { logger } from '@/utils/logger';
import { StateCreator } from 'zustand';
import { getMfaDevices } from '../actions/getMfaDevices';
import { GetMfaDevices } from '../models/get_mfa_devices';
import { MfaDevice } from '../models/mfa_device';
import { MfaDeviceType } from '../models/mfa_device_type';
import { SecuritySettingsStore } from './security_settings_store';

export type MfaDevicesStore = {
  loadMfaDevices: () => void;
  mfaDevices: Map<MfaDeviceType, MfaDevice>;
  defaultMfaDevices: Map<MfaDeviceType, MfaDevice>;
};

export const createMfaDevicesStore: StateCreator<
  SecuritySettingsStore,
  [],
  [],
  MfaDevicesStore
> = (set, get) => ({
  mfaDevices: new Map([
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
    try {
      const resp: ESResponse<GetMfaDevices> = await getMfaDevices('akash11!');
      set((state) => ({
        mfaDevices: new Map(
          JSON.parse(JSON.stringify([...state.defaultMfaDevices])),
        ),
      }));
      if (resp.data && resp.data.devices?.length) {
        resp.data.devices.forEach((item) => {
          const mfa = get().mfaDevices.get(
            item.deviceType.toLocaleLowerCase() as MfaDeviceType,
          );
          if (mfa) {
            mfa.enabled = item.deviceStatus == 'ACTIVE' ? true : false;
            if (mfa.deviceType == MfaDeviceType.email) {
              mfa.emailOrPhone = item.email;
            } else {
              mfa.emailOrPhone = item.phone;
            }
          }
        });
        set((state) => ({
          mfaDevices: new Map([...state.mfaDevices]),
        }));
      }
    } catch (err) {
      logger.error('Loading Mfa Devices failed');
      logger.error('GetDevices' + err);
    }
  },
});
