import { z } from 'zod';

export const DrugInfoSchema = z
  .object({
    drugName: z.string().nonempty('Please provide the name of the drug.'),
    drugStrength: z
      .string()
      .nonempty('Please specify the strength of the drug.'),
    purchasedDrug: z.boolean(),
    datePurchased: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Please provide a valid purchase date.',
      }),
    amountPaid: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(parseFloat(val)), {
        message: 'Please enter a valid amount paid.',
      }),
    pharmacyInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.purchasedDrug) {
        return data.datePurchased && data.amountPaid && data.pharmacyInfo;
      }
      return true;
    },
    {
      message:
        'If you purchased the drug, please provide the purchase date, amount paid, and pharmacy information.',
      path: ['purchasedDrug'],
    },
  );

export type DrugInfoStepModel = z.infer<typeof DrugInfoSchema>;
