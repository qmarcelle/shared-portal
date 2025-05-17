/* eslint-disable @typescript-eslint/no-explicit-any */
// Define a separate interface for formData
export interface DeterminationFormData {
  enrolleeInfo: Record<string, any>;
  prescriberInfo: Record<string, any>;
  drugInfo: Record<string, any>;
  requestType: Record<string, any>;
  additionalInfo: Record<string, any>;
}

export const firstColumnWidth: string = '25%';
