import { z } from 'zod';

// Define the schema for the form
export const AdditionalInfoSchema = z.object({
  additionalInfo: z.string().optional(),
  expeditedDecision: z.boolean().optional(),
});

// Export the inferred TypeScript type
export type AdditionalInfoStepModel = z.infer<typeof AdditionalInfoSchema>;
