import { z } from 'zod';
import { phoneNumberSchema, zipCodeSchema } from '../../BaseSchemas';

export const PrescriberInfoSchema = z.object({
  prescriberName: z
    .string()
    .min(1, { message: 'Please enter the prescriber’s name.' }),
  prescriberAddress1: z
    .string()
    .min(1, { message: 'Please provide the prescriber’s address.' }),
  prescriberAddress2: z.string().optional(),
  prescriberCity: z.string().min(1, { message: 'Please enter the city.' }),
  prescriberState: z.string().min(2, { message: 'Please select a state.' }),
  prescriberZipCode: zipCodeSchema.refine((val) => !!val, {
    message: 'Please provide a valid ZIP code.',
  }),
  prescriberPhoneNumber: phoneNumberSchema.refine((val) => !!val, {
    message: 'Please provide a valid phone number.',
  }),
  prescriberFax: phoneNumberSchema.refine((val) => !!val, {
    message: 'Please provide a valid fax number.',
  }),
  prescriberContact: z.string().or(z.literal('')).optional(),
});

export type PrescriberInfoStepModel = z.infer<typeof PrescriberInfoSchema>;
