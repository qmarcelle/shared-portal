import { z } from 'zod';
import {
  optionalPhoneNumberSchema,
  optionalZipCodeSchema,
  phoneNumberSchema,
} from '../../BaseSchemas';

export const EnrolleeInfoSchema = z
  .object({
    enrolleeFirstName: z
      .string()
      .min(1, 'Please enter the enrollee’s first name.'),
    enrolleeMiddleInitial: z.string().optional(),
    enrolleeLastName: z
      .string()
      .min(1, 'Please enter the enrollee’s last name.'),
    dateOfBirth: z.string().optional(),
    enrolleeAddress1: z.string().optional(),
    enrolleeAddress2: z.string().optional(),
    enrolleeCity: z.string().optional(),
    enrolleeState: z.string().optional(),
    enrolleeZipCode: optionalZipCodeSchema,
    enrolleePhone: phoneNumberSchema.refine((val) => !!val, {
      message: 'Please provide a valid phone number.',
    }),
    enrolleeMemberId: z
      .string()
      .min(1, 'Please provide the enrollee’s Member ID.'),
    isEnrolleeRequestor: z.boolean(),
    requestorFirstName: z.string().optional(),
    requestorMiddleInitial: z.string().optional(),
    requestorLastName: z.string().optional(),
    requestorRelationship: z.string().optional(),
    requestorAddress1: z.string().optional(),
    requestorAddress2: z.string().optional(),
    requestorCity: z.string().optional(),
    requestorState: z.string().optional(),
    requestorZipCode: optionalZipCodeSchema,
    requestorPhone: optionalPhoneNumberSchema,
  })
  .refine(
    (data) => {
      const requestorFields = [
        data.requestorFirstName,
        data.requestorLastName,
        data.requestorRelationship,
        data.requestorAddress1,
        data.requestorCity,
        data.requestorState,
        data.requestorZipCode,
        data.requestorPhone,
      ];
      const isAnySet = requestorFields.some(
        (field) => field !== undefined && field !== '',
      );
      const areAllRequiredSet = requestorFields.every((field, index) => {
        if (
          requestorFields[index] === data.requestorAddress2 ||
          requestorFields[index] === data.requestorMiddleInitial
        )
          return true;
        return field !== undefined && field !== '';
      });
      return !isAnySet || areAllRequiredSet;
    },
    {
      message:
        'If you provide any requestor information, all required fields (except Address 2) must be completed.',
    },
  );

export type EnrolleeInfoStepModel = z.infer<typeof EnrolleeInfoSchema>;
