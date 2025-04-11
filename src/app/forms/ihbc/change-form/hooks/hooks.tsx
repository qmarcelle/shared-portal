'use client';

/**
 * IHBC Change Form Custom Hooks
 *
 * This file contains custom hooks for the IHBC change form implementation.
 * These hooks handle form navigation, premium calculation, effective date options,
 * and form completion tracking.
 *
 * TODO: Add comprehensive unit tests for all hooks
 * TODO: Add error reporting and telemetry for hook failures
 * TODO: Improve type safety throughout
 */

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
// Import from relative paths to avoid dependency issues
import {
  validateBenefits,
  validateDependents,
  validateForm,
  validatePersonalInfo,
  validateSpecialEnrollment,
  validateTerminatePolicy,
} from '../../lib/schemas';
import { isSectionComplete, useFormStore } from '../stores/stores';

/**
 * Custom hook for form navigation
 * Manages tab navigation, validation, and routing
 *
 * TODO: Add accessibility support for keyboard navigation
 * TODO: Improve validation to show specific errors when moving between tabs
 * TODO: Add proper browser history management (back button support)
 */
export function useFormNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { selections, meta } = useFormStore();

  // Define all possible tabs with their paths and conditions
  const allTabs = useMemo(
    () => [
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
        isEnabled: () =>
          selections.addDependents || selections.removeDependents,
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
    ],
    [selections, meta.groupNumber],
  );

  // Get enabled tabs only
  const tabs = useMemo(() => {
    const enabledTabs = allTabs.filter((tab) => tab.isEnabled());

    // Update labels with correct numbers
    return enabledTabs.map((tab, index) => ({
      ...tab,
      label: `${index + 1}. ${tab.label.split('. ')[1]}`,
    }));
  }, [allTabs]);

  // Find the active tab index based on current pathname
  const activeTabIndex = useMemo(() => {
    return tabs.findIndex((tab) => tab.path === pathname);
  }, [tabs, pathname]);

  // Navigate to a specific tab
  const navigateToTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && tab.isEnabled()) {
        router.push(tab.path);
      }
    },
    [tabs, router],
  );

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
 * Calculates current premium and changes based on form selections
 *
 * TODO: [CRITICAL] Replace mock premium values with actual API integration
 * TODO: Add proper loading states and error handling for premium calculation
 * TODO: Support multiple tiers of premium calculation based on group
 */
export function usePremiumCalculation() {
  const { meta, selections, dependents, benefits } = useFormStore();

  const [currentPremium, setCurrentPremium] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current premium
  useEffect(() => {
    const fetchPremium = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Replace with actual API call to get current premium
        // This is currently using mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
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

    // TODO: Replace with actual premium calculation rules
    // Currently using placeholder values

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
    // TODO: Get actual plan pricing from API
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
  }, [isLoading, currentPremium, dependents, benefits]);

  return {
    currentPremium,
    newPremium,
    difference,
    isLoading,
    error,
  };
}

/**
 * Custom hook for calculating effective date options based on special enrollment event type and date
 * Implements complex business rules for determining valid effective dates
 *
 * TODO: Validate implementation against official BCBS rules
 * TODO: Add handling for 15th of month cutoff dates
 * TODO: Add special handling for specific group rules
 */
export function useEffectiveDateOptions(
  eventType: string | undefined,
  eventDate: string | undefined,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [effectiveDateOptions, setEffectiveDateOptions] = useState<string[]>(
    [],
  );

  // Calculate effective date options based on event type and date
  const calculateEffectiveDateOptions = useCallback(() => {
    if (!eventType || !eventDate) {
      setEffectiveDateOptions([]);
      return;
    }

    setIsLoading(true);

    try {
      const event = new Date(eventDate);
      const today = new Date();
      const options: string[] = [];

      // Format a date as YYYY-MM-DD for form input
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

      // Get first day of month
      const getFirstOfMonth = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setDate(1);
        return newDate;
      };

      // Get next month's first day
      const getFirstOfNextMonth = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(1);
        return newDate;
      };

      // Get date of birth rules (add child event)
      if (eventType === 'Birth/Adoption/Foster Care') {
        // Effective date can be the date of birth/adoption
        options.push(formatDate(event));

        // Or the first of the next month
        options.push(formatDate(getFirstOfNextMonth(event)));
      }
      // Marriage rules
      else if (eventType === 'Marriage') {
        // Effective date can be the date of marriage
        options.push(formatDate(event));

        // Or the first of the next month
        options.push(formatDate(getFirstOfNextMonth(event)));
      }
      // Loss of coverage rules
      else if (eventType === 'Loss of Coverage') {
        const isInFuture = event > today;

        if (isInFuture) {
          // If the loss of coverage is in the future, effective date must be the date of the event
          options.push(formatDate(event));
        } else {
          // If the loss of coverage is in the past, effective date can be:
          // 1. The first of the month following the event
          const firstFollowing = getFirstOfNextMonth(event);

          // 2. If the event happened in the past 60 days, the first of the current month is also an option
          // but only if we're within the first 15 days of the current month
          const currentDay = today.getDate();
          if (currentDay <= 15) {
            const firstOfCurrentMonth = getFirstOfMonth(today);
            options.push(formatDate(firstOfCurrentMonth));
          }

          // 3. The first of the next month is always an option
          const firstOfNextMonth = getFirstOfNextMonth(today);
          options.push(formatDate(firstFollowing));

          // Don't add duplicate dates
          if (formatDate(firstFollowing) !== formatDate(firstOfNextMonth)) {
            options.push(formatDate(firstOfNextMonth));
          }
        }
      }
      // Permanent move rules
      else if (eventType === 'Permanent Move') {
        const isInFuture = event > today;

        if (isInFuture) {
          // If the move is in the future, effective date must be the date of the event
          options.push(formatDate(event));

          // Or the first of the next month after the move
          options.push(formatDate(getFirstOfNextMonth(event)));
        } else {
          // If the move was in the past, effective date can be:
          // 1. The first of the month following the event
          const firstFollowing = getFirstOfNextMonth(event);
          options.push(formatDate(firstFollowing));

          // 2. If the event happened in the past 60 days, the first of the current month is an option
          // but only if we're within the first 15 days of the month
          const currentDay = today.getDate();
          if (currentDay <= 15) {
            const firstOfCurrentMonth = getFirstOfMonth(today);
            options.push(formatDate(firstOfCurrentMonth));
          }

          // 3. The first of the next month is always an option
          const firstOfNextMonth = getFirstOfNextMonth(today);

          // Don't add duplicate dates
          if (formatDate(firstFollowing) !== formatDate(firstOfNextMonth)) {
            options.push(formatDate(firstOfNextMonth));
          }
        }
      }
      // Loss or gain of dependent rules
      else if (
        eventType === 'Loss of Dependent' ||
        eventType === 'Gain Dependent'
      ) {
        // The first of the month following the event
        options.push(formatDate(getFirstOfNextMonth(event)));
      }

      // Sort dates
      options.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // Remove any dates in the past
      const filteredOptions = options.filter((date) => new Date(date) >= today);

      setEffectiveDateOptions(
        filteredOptions.length > 0 ? filteredOptions : options,
      );
    } catch (error) {
      console.error('Error calculating effective dates:', error);
      setEffectiveDateOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventType, eventDate]);

  // Calculate options when event type or date changes
  useMemo(() => {
    calculateEffectiveDateOptions();
  }, [calculateEffectiveDateOptions]);

  return { effectiveDateOptions, isLoading };
}

/**
 * Custom hook for tracking form completion status
 * Determines which sections of the form are complete
 *
 * TODO: Add more granular tracking of subsection completion
 * TODO: Integrate with browser local storage for persistence
 * TODO: Add percent complete tracking for progress indicators
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

interface Subscriber {
  firstName: string;
  lastName: string;
}

export function useSubscriberData() {
  // TODO: Replace with actual API call
  return {
    data: {
      firstName: 'John',
      lastName: 'Doe',
    } as Subscriber,
  };
}
