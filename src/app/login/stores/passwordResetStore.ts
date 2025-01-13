import { isValidPassword, validateDate } from '@/utils/inputValidator';
import { logger } from '@/utils/logger';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  callResetPassword,
  redirectToDashboard,
} from '../actions/resetPassword';
import { PasswordResetStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type PasswordResetStore = {
  password: string;
  dob: string;
  invalidDOBError: string[];
  invalidPasswordError: string[];
  isResetSuccess: boolean;
  updatePassword: (val: string) => void;
  updateDOB: (val: string) => void;
  resetPassword: () => Promise<void>;
  onContinue: () => Promise<void>;
  resetError: () => void;
};

export const usePasswordResetStore = createWithEqualityFn<PasswordResetStore>(
  (set, get) => ({
    password: '',
    dob: '',
    invalidDOBError: [],
    invalidPasswordError: [],
    isResetSuccess: false,
    updatePassword: (val: string) => {
      set(() => ({
        password: val.trim(),
      }));
      if (!isValidPassword(val)) {
        set(() => ({
          invalidPasswordError: [
            'Your password has an invalid character. Passwords can only use these characters: !@#$%^&*()+=-_',
          ],
        }));
      } else {
        set(() => ({
          invalidPasswordError: [],
        }));
      }
    },
    updateDOB: (val: string) => {
      set(() => ({
        dob: val.trim(),
      }));
      if (!validateDate(get().dob)) {
        set(() => ({
          invalidDOBError: ['Please enter a valid date.'],
        }));
      } else {
        set(() => ({
          invalidDOBError: [],
        }));
      }
    },
    resetError: () => {
      set(() => ({
        invalidDOBError: [],
        invalidPasswordError: [],
      }));
    },
    resetPassword: async () => {
      try {
        set(() => ({
          isResetSuccess: false,
          invalidDOBError: [],
          invalidPasswordError: [],
        }));
        const dobSplit = get().dob.split('/');
        const dateOfBirth = `${dobSplit?.[2]}-${dobSplit?.[0]}-${dobSplit?.[1]}`;
        const resp = await callResetPassword({
          newPassword: get().password,
          dateOfBirth: dateOfBirth,
          interactionId:
            useLoginStore.getState().interactionData?.interactionId ?? '',
          interactionToken:
            useLoginStore.getState().interactionData?.interactionToken ?? '',
          username: useLoginStore.getState().username,
        });

        switch (resp.status) {
          case PasswordResetStatus.RESET_OK:
            set(() => ({ isResetSuccess: true }));
            break;
          case PasswordResetStatus.PREVIOUS_PASSWORD:
            set(() => ({
              invalidPasswordError: [
                'Your new password can’t be the same as any of your last 10 passwords.',
              ],
            }));
            break;
          case PasswordResetStatus.COMMON_PASSWORD:
            set(() => ({
              invalidPasswordError: [
                'Your new password cannot be a commonly used password.',
              ],
            }));
            break;
          case PasswordResetStatus.DOB_NOT_MATCHED:
            set(() => ({
              invalidDOBError: [
                // eslint-disable-next-line quotes
                "This isn't the birthdate that we have on file for you. Please try again.",
              ],
            }));
            break;
          default:
            throw resp;
        }
      } catch (err) {
        logger.error('Error from Reset Password Api', err);
        useLoginStore.setState({ unhandledErrors: true });
      }
    },
    onContinue: async () => {
      await redirectToDashboard(useLoginStore.getState().username);
      useLoginStore.getState().updateLoggedUser(true);
    },
  }),
);
