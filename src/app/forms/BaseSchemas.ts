import { z } from 'zod';

export const phoneNumberSchema = z
  .string()
  .transform((val) => val.replace(/[()\-\s]/g, ''))
  .refine((val) => val.replace(/\D/g, '').length >= 10, {
    message: 'Phone number must contain at least 10 digits',
  });

export const optionalPhoneNumberSchema = z
  .string()
  .optional()
  .refine((val) => !val || val.replace(/\D/g, '').length >= 10, {
    message: 'Phone number must contain at least 10 digits',
  })
  .transform((val) => (val ? val.replace(/[()\-\s]/g, '') : val));

export const zipCodeSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\d{5}(-\d{4})?$/.test(val), {
    message: 'Invalid Zip Code format',
  });

export const optionalZipCodeSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\d{5}(-\d{4})?$/.test(val), {
    message: 'Invalid Zip Code format',
  });
