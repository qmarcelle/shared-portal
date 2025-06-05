import { z } from 'zod';

export const ihbcSchema = z.object({
  changePersonalInfo: z
    .object({
      changeName: z
        .object({
          firstName: z.string().min(1, 'First Name is empty').max(15),
          lastName: z.string().min(1, 'Last name is empty').max(35),
          mi: z.string().min(1, 'MI is missing').max(1),
          reason: z.string().optional(),
        })
        .optional(),
      changeAddress: z
        .object({
          residence: z
            .object({
              street: z.string().max(65),
              city: z.string().max(57),
              zip: z.string().length(5),
              state: z.string(),
              county: z.string(),
            })
            .optional(),
          mailing: z
            .object({
              street: z.string().max(65),
              city: z.string().max(57),
              zip: z.string().length(5),
              state: z.string(),
            })
            .optional(),
          billing: z
            .object({
              street: z.string().max(65),
              city: z.string().max(57),
              zip: z.string().length(5),
              state: z.string(),
            })
            .optional(),
        })
        .optional(),
      changePhone: z
        .string()
        .length(10, 'Please enter correct phone number')
        .optional(),
      changeEmailAddress: z
        .string()
        .email('Incorrect email address')
        .optional(),
      changeTobaccoUse: z
        .object({
          primaryApplicant: z.enum(['Y', 'N']).optional(),
          spouse: z.enum(['Y', 'N']).optional(),
        })
        .optional(),
    })
    .optional(),
  removeDeps: z
    .object({
      spouse: z
        .object({
          firstName: z
            .string()
            .min(1, 'First Name is missing')
            .max(15, 'First Name is more than 15 characters'),
          lastName: z
            .string()
            .min(1)
            .max(35, 'Last Name is more than 35 characters'),
          mi: z.string().min(1, 'MI is missing').max(1),
          dob: z.string().min(10, 'Date of Birth cannot be empty'),
          terminationDate: z
            .string()
            .min(10, 'Termination date cannot be empty'),
          terminationReason: z.string().min(1, 'Please add a reason'),
        })
        .optional(),
      dependents: z
        .array(
          z.object({
            firstName: z
              .string()
              .min(1, 'First Name is missing')
              .max(15, 'First Name is more than 15 characters'),
            lastName: z
              .string()
              .min(1)
              .max(35, 'Last Name is more than 35 characters'),
            mi: z.string().min(1, 'MI is missing').max(1),
            dob: z.string().min(10, 'Date of Birth cannot be empty'),
            terminationDate: z
              .string()
              .min(10, 'Termination date cannot be empty'),
            terminationReason: z.string().min(1, 'Please add a reason'),
          }),
        )
        .optional(),
    })
    .optional(),
  addDeps: z
    .object({
      zip: z.string().min(5).max(5),
      county: z.string(),
      dependents: z
        .array(
          z.object({
            firstName: z.string().min(1).max(15),
            dob: z.string().min(10, 'Date of Birth cannot be empty'),
            relationship: z
              .string()
              .min(1)
              .refine((item) => item != '0'),
            gender: z.enum(['M', 'F']),
            tobaccoUse: z
              .enum(['Y', 'N', '0'])
              .refine((item) => ['Y', 'N'].includes(item)),
          }),
        )
        .optional(),
      existingDeps: z
        .array(
          z.object({
            firstName: z.string().min(1).max(15),
            dob: z.string().min(10, 'Date of Birth cannot be empty'),
            relationship: z
              .string()
              .min(1)
              .refine((item) => item != '0'),
            gender: z.enum(['M', 'F']),
            tobaccoUse: z
              .enum(['Y', 'N', '0'])
              .refine((item) => ['Y', 'N'].includes(item)),
          }),
        )
        .optional(),
    })
    .optional(),
  terminatePolicy: z
    .object({
      terminatePrimaryApplicant: z
        .object({
          terminationDate: z
            .string()
            .min(10, 'Termination date cannot be empty'),
          terminationReason: z.string().min(1, 'Please add a reason'),
        })
        .optional(),
      cancelMedicalPolicy: z
        .object({
          terminationDate: z
            .string()
            .min(10, 'Termination date cannot be empty'),
          terminationReason: z.string().min(1, 'Please add a reason'),
        })
        .optional(),
      cancelDentalPolicy: z
        .object({
          terminationDate: z
            .string()
            .min(10, 'Termination date cannot be empty'),
          terminationReason: z.string().min(1, 'Please add a reason'),
        })
        .optional(),
      cancelVisionPolicy: z
        .object({
          terminationDate: z
            .string()
            .min(10, 'Termination date cannot be empty'),
          terminationReason: z.string().min(1, 'Please add a reason'),
        })
        .optional(),
    })
    .optional(),
});

export type IHBCSchema = z.infer<typeof ihbcSchema>;
