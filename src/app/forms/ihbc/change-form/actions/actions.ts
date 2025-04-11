'use server';

import { formSchema } from '@/lib/insurance/schemas';
import { revalidatePath } from 'next/cache';

type FormData = {
  meta: {
    applicationId: string;
    groupNumber: string;
    subscriberId: string;
    status: string;
    lastSaved: string;
    submittedDate?: string;
  };
  selections: Record<string, boolean>;
  personalInfo?: any;
  dependents?: any;
  benefits?: any;
  specialEnrollment?: any;
  terminatePolicy?: any;
};

type SubmissionResult = {
  success: boolean;
  errors?: Record<string, string> | null;
  message?: string;
  confirmationNumber?: string;
};

/**
 * Server action to save application draft
 */
export async function saveApplicationDraft(formData: FormData): Promise<SubmissionResult> {
  try {
    // Validate the form data
    const result = formSchema.safeParse(formData);
    
    if (!result.success) {
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: 'Validation failed'
      };
    }
    
    // Save to database - in a real app, this would be an API call
    console.log('Saving draft:', result.data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revalidate the applications list page
    revalidatePath('/insurance/applications');
    
    return {
      success: true,
      message: 'Application saved successfully'
    };
  } catch (error) {
    console.error('Error saving application:', error);
    
    return {
      success: false,
      message: 'Failed to save application'
    };
  }
}

/**
 * Server action to submit the application
 */
export async function submitApplication(formData: FormData): Promise<SubmissionResult> {
  try {
    // Validate the form data
    const result = formSchema.safeParse(formData);
    
    if (!result.success) {
      return {
        success: false,
        errors: formatZodErrors(result.error),
        message: 'Validation failed'
      };
    }
    
    // Update the application status to submitted
    const submittedApplication = {
      ...result.data,
      meta: {
        ...result.data.meta,
        status: 'Submitted',
        submittedDate: new Date().toISOString(),
        lastSaved: new Date().toISOString(),
      }
    };
    
    // Submit to database - in a real app, this would be an API call
    console.log('Submitting application:', submittedApplication);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber();
    
    // Revalidate the applications list page
    revalidatePath('/insurance/applications');
    
    // Return success
    return {
      success: true,
      message: 'Application submitted successfully',
      confirmationNumber
    };
  } catch (error) {
    console.error('Error submitting application:', error);
    
    return {
      success: false,
      message: 'Failed to submit application'
    };
  }
}

/**
 * Helper function to format Zod errors
 */
function formatZodErrors(error: any): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  if (error?.issues) {
    error.issues.forEach((issue: any) => {
      const path = issue.path.join('.');
      formattedErrors[path] = issue.message;
    });
  }
  
  return formattedErrors;
}

/**
 * Generate a unique confirmation number
 */
function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CNF-${timestamp}-${random}`;
}