import {
  isConfirmEmailAddressMatch,
  isValidEmailAddress,
  validateLength,
} from '@/utils/inputValidator';
import { logger } from '@/utils/logger';
import { createWithEqualityFn } from 'zustand/traditional';
import { callUpdateEmail } from '../actions/emailUniqueness';
import { EmailUniquenessStatus } from '../models/status';
import { useLoginStore } from './loginStore';

type EmailUniquenessStore = {
  emailAddress: string;
  confirmEmailAddress: string;
  invalidEmailError: string[];
  invalidConfirmEmailError: string[];
  isApiError: boolean;
  updateEmailAddress: (val: string) => void;
  updateConfirmEmailAddress: (val: string) => void;
  updateEmail: () => Promise<void>;
  resetError: () => void;
};

export const useEmailUniquenessStore =
  createWithEqualityFn<EmailUniquenessStore>((set, get) => ({
    emailAddress: '',
    confirmEmailAddress: '',
    invalidEmailError: [],
    invalidConfirmEmailError: [],
    isApiError: false,
    updateEmailAddress: (value: string) => {
      const isValidEmail = isValidEmailAddress(value);
      const isValidLength = validateLength(value);
      let invalidEmail: string[] = [];
      let invalidConfirmEmail: string[] = [];
      if (
        (isValidEmail && !isValidLength) ||
        (!isValidEmail && !isValidLength) ||
        (!isValidEmail && isValidLength)
      ) {
        invalidEmail = ['Please enter a valid Email address.'];
      }
      if (
        !isConfirmEmailAddressMatch(value, get().confirmEmailAddress) &&
        get().confirmEmailAddress !== ''
      ) {
        invalidConfirmEmail = [
          'The email addresses must match. Please check and try again.',
        ];
      }
      set(() => ({
        invalidEmailError: invalidEmail,
        invalidConfirmEmailError: invalidConfirmEmail,
        emailAddress: value,
      }));
    },
    updateConfirmEmailAddress: (value: string) => {
      const isEmailMatch = isConfirmEmailAddressMatch(
        value,
        get().emailAddress,
      );
      set(() => ({ confirmEmailAddress: value, isApiError: false }));
      if (!isEmailMatch) {
        set(() => ({
          invalidConfirmEmailError: [
            'The email addresses must match. Please check and try again.',
          ],
        }));
      } else {
        set(() => ({
          invalidConfirmEmailError: [],
        }));
      }
    },
    resetError: () => {
      set(() => ({
        invalidEmailError: [],
        invalidConfirmEmailError: [],
      }));
    },
    updateEmail: async () => {
      try {
        set(() => ({
          invalidEmailError: [],
          invalidConfirmEmailError: [],
        }));
        const resp = await callUpdateEmail({
          newEmail: get().emailAddress,
          interactionId:
            useLoginStore.getState().interactionData?.interactionId ?? '',
          interactionToken:
            useLoginStore.getState().interactionData?.interactionToken ?? '',
        });

        switch (resp.status) {
          case EmailUniquenessStatus.VERIFY_EMAIL:
            useLoginStore.setState({ emailUniqueness: false });
            useLoginStore.getState().setVerifyUniqueEmail(resp);
            break;
          case EmailUniquenessStatus.INVALID_EMAIL:
            set(() => ({
              invalidConfirmEmailError: [
                // eslint-disable-next-line quotes
                "We can't send emails to this address. Please enter a valid address.",
              ],
              isApiError: true,
            }));
            break;
          case EmailUniquenessStatus.EMAIL_ALREADY_IN_USE:
            set(() => ({
              invalidConfirmEmailError: [
                'The email address entered is already in use by another account. Please choose a different email address.',
              ],
              isApiError: true,
            }));
            break;
          default:
            throw resp;
        }
      } catch (err) {
        logger.error('Error from Email Uniqueness Api', err);
        useLoginStore.setState({ unhandledErrors: true });
      }
    },
  }));
