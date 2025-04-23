import { auth } from '@/auth';
import { chatService } from '@/services/chatService';
import { useEffect, useState } from 'react';

interface EligibilityState {
  isEligible: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useChatEligibility = (isTestMode: boolean = false) => {
  const [state, setState] = useState<EligibilityState>({
    isEligible: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkEligibility = async () => {
      if (isTestMode) {
        // Mock eligibility for testing
        setState({
          isEligible: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        const session = await auth();

        if (!session?.user) {
          setState({
            isEligible: false,
            isLoading: false,
            error: new Error('User not authenticated'),
          });
          return;
        }

        const eligibility = await chatService.checkEligibility();
        setState({
          isEligible: eligibility.isEligible,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isEligible: false,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    checkEligibility();
  }, [isTestMode]);

  return state;
};
