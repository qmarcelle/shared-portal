'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Button } from '@/components/foundation/Button';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Row } from '@/components/foundation/Row';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTabs, Tab } from './components/form-tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../../lib/schemas';
import { useFormStore } from '../stores/stores';
import { trackFormAnalytics } from '@/lib/analytics';
import { Dialog } from '@/components/foundation/Dialog';

/**
 * Simple error boundary component
 */
function ErrorBoundary({
  children,
  fallbackRender,
}: {
  children: React.ReactNode;
  fallbackRender: (props: { error: Error }) => React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return fallbackRender({ error });
  }

  // Use key to force remount on error
  return (
    <div
      key={Date.now()}
      onError={(e: any) => {
        setError(e.error || new Error('Unknown error occurred'));
      }}
    >
      {children}
    </div>
  );
}

/**
 * Form Layout Component
 *
 * Main layout for the insurance change form that handles navigation,
 * progress tracking, and form state management.
 *
 * TODO: [CRITICAL] Fix dependency errors with @hookform/resolvers/zod and react-error-boundary
 * TODO: [CRITICAL] Implement full Zod schema integration for form validation
 * TODO: [HIGH] Add autosave functionality with optimistic UI updates
 * TODO: [HIGH] Implement group-specific form layout variations
 * TODO: [MEDIUM] Add form analytics tracking for user progression
 * TODO: [MEDIUM] Implement accessible keyboard navigation
 * TODO: [LOW] Add print-friendly version of the form
 */
export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { saveFormData, loadFormData } = useFormStore();

  // Initialize form with react-hook-form and Zod schema
  const methods = useForm({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: loadFormData() // Load saved form data if available
  });

  // Autosave functionality
  const saveFormProgress = useCallback(async (data: any) => {
    try {
      await saveFormData(data);
    } catch (error) {
      console.error('Error saving form progress:', error);
    }
  }, [saveFormData]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      saveFormProgress(value);
    });
    return () => subscription.unsubscribe();
  }, [methods, saveFormProgress]);

  // Analytics tracking
  useEffect(() => {
    trackFormAnalytics({
      step: activeTabIndex + 1,
      section: tabs[activeTabIndex].section,
      isComplete: false
    });
  }, [activeTabIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isLastTab && !isSubmitting) {
        handleContinue();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isLastTab, isSubmitting]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (methods.formState.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [methods.formState.isDirty]);

  // Complete tabs structure
  const tabs: Tab[] = [
    {
      id: 'select-changes',
      label: '1. Select Changes',
      path: '/forms/ihbc/change-form',
      isEnabled: () => true,
      section: 'selectChanges',
    },
    {
      id: 'personal-info',
      label: '2. Personal Info',
      path: '/forms/ihbc/change-form/personal-info',
      isEnabled: () => true,
      section: 'personalInfo',
    },
    {
      id: 'dependents',
      label: '3. Dependents',
      path: '/forms/ihbc/change-form/dependents',
      isEnabled: () => methods.getValues('selections.addDependents') || 
                      methods.getValues('selections.removeDependents'),
      section: 'dependents',
    },
    {
      id: 'benefits',
      label: '4. Benefits',
      path: '/forms/ihbc/change-form/benefits',
      isEnabled: () => methods.getValues('selections.changeBenefits'),
      section: 'benefits',
    },
    {
      id: 'special-enrollment',
      label: '5. Special Enrollment',
      path: '/forms/ihbc/change-form/special-enrollment',
      isEnabled: () => methods.getValues('selections.addDependents') || 
                      methods.getValues('selections.changeBenefits'),
      section: 'specialEnrollment',
    },
    {
      id: 'terminate-policy',
      label: '6. Terminate Policy',
      path: '/forms/ihbc/change-form/terminate-policy',
      isEnabled: () => methods.getValues('selections.terminatePolicy'),
      section: 'terminatePolicy',
    },
    {
      id: 'review',
      label: '7. Review & Submit',
      path: '/forms/ihbc/change-form/review',
      isEnabled: () => true,
      section: 'review',
    },
  ];

  // Handle continue button click
  const handleContinue = async () => {
    try {
      setValidationError(null);
      const isValid = await methods.trigger();

      if (isValid && activeTabIndex < tabs.length - 1) {
        setActiveTabIndex(activeTabIndex + 1);
        // Navigate to next tab
        router.push(tabs[activeTabIndex + 1].path);
      } else if (!isValid) {
        setValidationError('Please fix the errors before proceeding');
      }
    } catch (error) {
      setValidationError('An error occurred while validating the form');
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
      router.push(tabs[activeTabIndex - 1].path);
    } else {
      // Handle back to dashboard or previous page
      router.push('/dashboard');
    }
  };

  // Determine if current tab is the last one
  const isLastTab = activeTabIndex === tabs.length - 1;

  // Calculate progress percentage
  const progressPercent = ((activeTabIndex + 1) / tabs.length) * 100;

  const handleSaveAndExit = async () => {
    await saveFormProgress(methods.getValues());
    router.push('/dashboard');
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: Error }) => (
        <div className="container mx-auto p-4 text-red-600 bg-red-50 rounded-md">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-2">
            Please try again or contact support if the problem persists.
          </p>
          <p className="mb-4">Error details: {error.message}</p>
          <Button
            label="Reload page"
            type="primary"
            callback={() => window.location.reload()}
          />
        </div>
      )}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Change Request Form</h1>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar
            height={4}
            completePercent={progressPercent}
            backgroundColor="bg-gray-200"
            progressColor="bg-blue-600"
          />
        </div>

        <FormProvider {...methods}>
          <form>
            <div className="bg-white rounded-md shadow-sm mb-6">
              <FormTabs
                tabs={tabs}
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
              />

              {validationError && (
                <div className="px-6 pt-4">
                  <AlertBar alerts={[validationError]} />
                </div>
              )}

              <div className="p-6" role="main" aria-label={`Form Step ${activeTabIndex + 1}: ${tabs[activeTabIndex].label}`}>
                {children}
              </div>
            </div>

            <Row className="justify-between mt-6">
              <div className="flex gap-4">
                <Button
                  label={activeTabIndex === 0 ? 'Cancel' : 'Previous'}
                  type="secondary"
                  callback={isSubmitting ? undefined : handleBack}
                />
                <Button
                  label="Save & Exit"
                  type="secondary"
                  callback={handleSaveAndExit}
                />
              </div>

              <Button
                label={isLastTab ? 'Submit' : 'Continue'}
                type="primary"
                callback={
                  isSubmitting || isLastTab ? undefined : handleContinue
                }
              />
            </Row>
          </form>
        </FormProvider>

        {/* Exit Confirmation Dialog */}
        <Dialog
          isOpen={showExitDialog}
          onClose={() => setShowExitDialog(false)}
          title="Save Changes?"
          content="You have unsaved changes. Would you like to save before exiting?"
          actions={[
            {
              label: 'Save & Exit',
              onClick: handleSaveAndExit,
              type: 'primary'
            },
            {
              label: 'Exit Without Saving',
              onClick: () => router.push('/dashboard'),
              type: 'secondary'
            },
            {
              label: 'Cancel',
              onClick: () => setShowExitDialog(false),
              type: 'tertiary'
            }
          ]}
        />

        {/* TODO: [MEDIUM] Add sticky help panel with context-sensitive assistance */}
        {/* TODO: [MEDIUM] Implement persistent premium calculation summary */}
        {/* TODO: [LOW] Add accessibility features like screen reader announcements */}
      </div>
    </ErrorBoundary>
  );
}
