'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormProvider, useForm } from 'react-hook-form';

import { FormTabs } from '@/components/insurance-form/form-tabs';
import { Button } from '@/components/ui/button';
import { useFormNavigation, usePremiumCalculation } from '@/lib/insurance/hooks';
import { formSchema } from '@/lib/insurance/schemas';
import { useFormStore } from '@/lib/insurance/stores';

export default function FormLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    tabs, 
    activeTabIndex, 
    navigateToNextTab, 
    navigateToPreviousTab, 
    saveAndExit 
  } = useFormNavigation();
  
  // Get store state
  const { 
    meta, 
    initializeApplication, 
    getFormData, 
    updateLastSaved 
  } = useFormStore();
  
  // Get premium calculation
  const { currentPremium, newPremium, difference, isLoading: isPremiumLoading } = usePremiumCalculation();
  
  // Setup form with zod resolver
  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: getFormData(),
  });
  
  // Initialize application if needed
  useEffect(() => {
    if (!meta.applicationId) {
      // In a real app, this would come from the user context or API
      initializeApplication('129800', 'SUB12345678');
    }
  }, [meta.applicationId, initializeApplication]);
  
  // Auto-save form when values change (debounced)
  useEffect(() => {
    const subscription = methods.watch(() => {
      const timeoutId = setTimeout(() => {
        updateLastSaved();
      }, 2000); // 2 second debounce
      
      return () => clearTimeout(timeoutId);
    });
    
    return () => subscription.unsubscribe();
  }, [methods, updateLastSaved]);
  
  // Handle continue button click
  const handleContinue = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      navigateToNextTab();
    }
  };
  
  // Determine if current tab is the last one
  const isLastTab = activeTabIndex === tabs.filter(tab => tab.isEnabled()).length - 1;
  
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="container mx-auto p-4 text-red-600 bg-red-50 rounded-md">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-2">Please try again or contact support if the problem persists.</p>
          <p className="mb-4">Error details: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Reload page
          </button>
        </div>
      )}
    >
      <div className="container mx-auto p-4">
        <header className="bg-blue-600 text-white p-4 mb-6 rounded-md">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">BlueCross BlueShield Insurance Change Form</h1>
            <span>Application ID: {meta.applicationId || 'New Application'}</span>
          </div>
        </header>
        
        {/* Premium Calculation Panel */}
        <div className="fixed top-24 right-6 w-72 z-10 bg-blue-50 border border-blue-200 p-4 rounded shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Calculation</h3>
          
          {isPremiumLoading ? (
            <p className="text-center text-gray-600">Calculating...</p>
          ) : (
            <>
              <div className="flex justify-between font-medium">
                <span>Current Premium:</span>
                <span>${currentPremium.toFixed(2)}/month</span>
              </div>
              
              <div className="flex justify-between mt-2">
                <span>New Premium:</span>
                <span>${newPremium.toFixed(2)}/month</span>
              </div>
              
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Difference:</span>
                  <span className={difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-600'}>
                    ${Math.abs(difference).toFixed(2)}/month {difference > 0 ? '↑' : difference < 0 ? '↓' : ''}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Form Navigation */}
        <FormTabs tabs={tabs} currentPath={pathname} />
        
        {/* Form Content */}
        <FormProvider {...methods}>
          <form>
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              {children}
            </div>
            
            {/* Form Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={saveAndExit}
                type="button"
              >
                Save & Exit
              </Button>
              
              <div className="flex space-x-4">
                {activeTabIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={navigateToPreviousTab}
                    type="button"
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={isLastTab ? methods.handleSubmit(() => {}) : handleContinue}
                  type={isLastTab ? 'submit' : 'button'}
                >
                  {isLastTab ? 'Submit Application' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </ErrorBoundary>
  );
}