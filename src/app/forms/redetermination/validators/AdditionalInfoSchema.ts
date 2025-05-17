import { z } from 'zod';

// Define the schema for the form
export const AdditionalInfoSchema = z.object({
  additionalInfo: z.string().optional(),
  expeditedDecision: z.boolean().optional(),
  signature: z.string().nonempty('Please provide your signature to proceed.'),
  signatureDate: z
    .string()
    .nonempty('Please select a valid date for your signature.'),
});

// Export the inferred TypeScript type
export type AdditionalInfoStepModel = z.infer<typeof AdditionalInfoSchema>;
