import { create } from 'zustand';
import { MfaDevicesStore, createMfaDevicesStore } from './mfa_devices_store';
import {
  UpdateMfaDevicesStore,
  createUpdateMfaDevicesStore,
} from './update_mfa_devices_store';

export type SecuritySettingsStore = UpdateMfaDevicesStore & MfaDevicesStore;
export const useSecuritySettingsStore = create<SecuritySettingsStore>(
  (...a) => ({
    ...createMfaDevicesStore(...a),
    ...createUpdateMfaDevicesStore(...a),
  }),
);
