'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  validateBenefits,
  validateDependents,
  validateForm,
  validatePersonalInfo,
  validateSpecialEnrollment,
  validateTerminatePolicy
} from './schemas';
import { isSectionComplete, useFormStore } from './stores';

/**
 * Custom hook for form navigation
 */
export function useFormNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { selections, meta } = useFormStore();
  
  // Define all possible tabs with their paths and conditions
  const allTabs = useMemo(() => [
    {
      id: 'select-changes',
      path: '/insurance/change-form',
      label: '1. Select Changes',
      isEnabled: () => true, // Always enabled
      section: 'selections',
    },
    {
      id: 'personal-info',
      path: '/insurance/change-form/personal-info',
      label: '2. Personal Info',
      isEnabled: () => selections.changePersonalInfo,
      section: 'personal-info',
      validate: () => {
        const { personalInfo } = useFormStore.getState();
        if (!personalInfo) return true; // No data to validate yet
        return validatePersonalInfo(personalInfo).valid;
      },
    },
    {
      id: 'dependents',
      path: '/insurance/change-form/dependents',
      label: '3. Dependents',
      isEnabled: () => selections.addDependents || selections.removeDependents,
      section: 'dependents',
      validate: () => {
        const { dependents } = useFormStore.getState();
        if (!dependents) return true; // No data to validate yet
        return validateDependents(dependents).valid;
      },
    },
    {
      id: 'benefits',
      path: '/insurance/change-form/benefits',
      label: '4. Plan Selection',
      isEnabled: () => selections.changeBenefits,
      section: 'benefits',
      validate: () => {
        const { benefits } = useFormStore.getState();
        if (!benefits) return true; // No data to validate yet
        return validateBenefits(benefits).valid;
      },
    },
    {
      id: 'special-enrollment',
      path: '/insurance/change-form/special-enrollment',
      label: '5. Special Enrollment',
      isEnabled: () => {
        return (
          meta.groupNumber === '129800' && 
          (selections.addDependents || selections.changeBenefits)
        );
      },
      section: 'special-enrollment',
      validate: () => {
        const { specialEnrollment } = useFormStore.getState();
        if (!specialEnrollment) return true; // No data to validate yet
        return validateSpecialEnrollment(specialEnrollment).valid;
      },
    },
    {
      id: 'terminate-policy',
      path: '/insurance/change-form/terminate-policy',
      label: '6. Terminate Policy',
      isEnabled: () => selections.terminatePolicy,
      section: 'terminate-policy',
      validate: () => {
        const { terminatePolicy } = useFormStore.getState();
        if (!terminatePolicy) return true; // No data to validate yet
        return validateTerminatePolicy(terminatePolicy).valid;
      },
    },
    {
      id: 'review',
      path: '/insurance/change-form/review',
      label: '7. Review & Submit',
      isEnabled: () => true, // Always enabled
      section: 'review',
      validate: () => {
        const formData = useFormStore.getState().getFormData();
        return validateForm(formData).valid;
      },
    },
  ], [selections, meta.groupNumber]);
  
  // Get enabled tabs only
  const tabs = useMemo(() => {
    const enabledTabs = allTabs.filter(tab => tab.isEnabled());
    
    // Update labels with correct numbers
    return enabledTabs.map((tab, index) => ({
      ...tab,
      label: `${index + 1}. ${tab.label.split('. ')[1]}`,
    }));
  }, [allTabs]);
  
  // Find the active tab index based on current pathname
  const activeTabIndex = useMemo(() => {
    return tabs.findIndex(tab => tab.path === pathname);
  }, [tabs, pathname]);
  
  // Navigate to a specific tab
  const navigateToTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && tab.isEnabled()) {
      router.push(tab.path);
    }
  }, [tabs, router]);
  
  // Navigate to the next enabled tab
  const navigateToNextTab = useCallback(() => {
    // If we're on the last tab or can't find the current tab, do nothing
    if (activeTabIndex === -1 || activeTabIndex >= tabs.length - 1) {
      return false;
    }
    
    // Get the current tab to check if validation is needed
    const currentTab = tabs[activeTabIndex];
    
    // If the current tab has a validate function, run it before proceeding
    if (currentTab.validate) {
      const isValid = currentTab.validate();
      if (!isValid) {
        // Don't navigate if validation fails
        return false;
      }
    }
    
    // Navigate to the next enabled tab
    const nextTab = tabs[activeTabIndex + 1];
    router.push(nextTab.path);
    return true;
  }, [tabs, activeTabIndex, router]);
  
  // Navigate to the previous enabled tab
  const navigateToPreviousTab = useCallback(() => {
    // If we're on the first tab or can't find the current tab, do nothing
    if (activeTabIndex <= 0) {
      return false;
    }
    
    // Navigate to the previous enabled tab
    const previousTab = tabs[activeTabIndex - 1];
    router.push(previousTab.path);
    return true;
  }, [tabs, activeTabIndex, router]);
  
  // Check if the form is valid for submission
  const isFormValid = useCallback(() => {
    const formData = useFormStore.getState().getFormData();
    return validateForm(formData).valid;
  }, []);
  
  // Save and exit
  const saveAndExit = useCallback(() => {
    useFormStore.getState().updateLastSaved();
    router.push('/insurance');
  }, [router]);
  
  return {
    tabs,
    activeTabIndex,
    navigateToTab,
    navigateToNextTab,
    navigateToPreviousTab,
    isFormValid,
    saveAndExit,
  };
}

/**
 * Custom hook for premium calculation
 */
export function usePremiumCalculation() {
  const {
    meta,
    selections,
    dependents,
    benefits,
  } = useFormStore();
  
  const [currentPremium, setCurrentPremium] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the current premium
  useEffect(() => {
    const fetchPremium = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // This would be an API call in a real app
        // For demo purposes, use a placeholder value after a short delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentPremium(1236.13);
        
      } catch (err) {
        setError('Failed to load premium information');
        console.error('Error fetching premium:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPremium();
  }, [meta.subscriberId]);
  
  // Calculate the new premium based on selections
  const { newPremium, difference } = useMemo(() => {
    if (isLoading) {
      return { newPremium: 0, difference: 0 };
    }
    
    let premium = currentPremium;
    
    // Dependents adjustments
    if (dependents?.add?.addSpouse) {
      premium += 500; // Example spouse premium
    }
    
    if (dependents?.add?.dependents?.length) {
      premium += dependents.add.dependents.length * 300; // Example dependent premium
    }
    
    if (dependents?.remove?.removeSpouse) {
      premium -= 500; // Example spouse premium reduction
    }
    
    if (dependents?.remove?.dependents?.length) {
      premium -= dependents.remove.dependents.length * 300; // Example dependent premium reduction
    }
    
    // Plan adjustments - using placeholder values
    if (benefits?.changeMedicalPlan) {
      if (benefits.medicalPlanId === 'silver-s01p') {
        premium += 220.62;
      } else if (benefits.medicalPlanId === 'gold-g01p') {
        premium += 640.09;
      } else if (benefits.medicalPlanId === 'bronze-b01s') {
        premium -= 237.63;
      }
    }
    
    if (benefits?.changeDentalPlan) {
      premium += 50; // Example dental premium change
    }
    
    if (benefits?.changeVisionPlan) {
      premium += 25; // Example vision premium change
    }
    
    return {
      newPremium: premium,
      difference: premium - currentPremium,
    };
  }, [
    isLoading,
    currentPremium,
    dependents,
    benefits,
  ]);
  
  return {
    currentPremium,
    newPremium,
    difference,
    isLoading,
    error,
  };
}

/**
 * Custom hook for tracking form completion status
 */
export function useFormCompletion() {
  const { selections } = useFormStore();
  
  const completionStatus = useMemo(() => {
    return {
      selectChanges: isSectionComplete('selections'),
      personalInfo: isSectionComplete('personal-info'),
      dependents: isSectionComplete('dependents'),
      benefits: isSectionComplete('benefits'),
      specialEnrollment: isSectionComplete('special-enrollment'),
      terminatePolicy: isSectionComplete('terminate-policy'),
    };
  }, [selections]);
  
  return completionStatus;
}