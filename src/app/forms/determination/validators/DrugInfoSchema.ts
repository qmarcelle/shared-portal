import { z } from 'zod';

export const DrugInfoSchema = z.object({
  drugName: z.string().nonempty('Please provide the name of the drug.'),
  drugStrength: z.string().nonempty('Please specify the strength of the drug.'),
  quantityRequested: z
    .string()
    .refine(
      (value) => /^[a-zA-Z0-9\s]*$/.test(value),
      'Quantity must only contain numbers, letters, or spaces.',
    )
    .optional(),
});

export type DrugInfoStepModel = z.infer<typeof DrugInfoSchema>;
