import { z } from 'zod';

export const RequestTypeSchema = z.object({
  requestType: z
    .object({
      notOnList: z.boolean().optional(),
      removedFromList: z.boolean().optional(),
      priorAuthorization: z.boolean().optional(),
      tryAnotherDrug: z.boolean().optional(),
      quantityLimit: z.boolean().optional(),
      lowerCopayment: z.boolean().optional(),
      copaymentTierChange: z.boolean().optional(),
      higherCopayment: z.boolean().optional(),
      reimbursement: z.boolean().optional(),
    })
    .refine((data) => Object.values(data).some((value) => value === true), {
      message: 'Please select at least one request type.',
    }),
  selectedRequestTypes: z.array(z.string()),
});

export type RequestTypeInfoStepModel = z.infer<typeof RequestTypeSchema>;
