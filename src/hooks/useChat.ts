import { useEffect, useState } from 'react';
import { useChatEligibility } from './useChatEligibility';

interface Plan {
  id: string;
  name: string;
}

interface ChatState {
  isChatReady: boolean;
  isChatVisible: boolean;
  currentPlan: Plan | null;
  availablePlans: Plan[];
}

export const useChat = (isTestMode: boolean = false) => {
  const [state, setState] = useState<ChatState>({
    isChatReady: false,
    isChatVisible: false,
    currentPlan: null,
    availablePlans: [],
  });

  const { isEligible, isLoading, error } = useChatEligibility(isTestMode);

  useEffect(() => {
    if (isTestMode) {
      // Mock data for testing
      setState((prev) => ({
        ...prev,
        isChatReady: true,
        currentPlan: { id: 'test-plan', name: 'Test Plan' },
        availablePlans: [
          { id: 'test-plan', name: 'Test Plan' },
          { id: 'test-plan-2', name: 'Test Plan 2' },
        ],
      }));
    } else {
      // Real implementation will go here
      setState((prev) => ({
        ...prev,
        isChatReady: isEligible && !isLoading && !error,
      }));
    }
  }, [isEligible, isLoading, error, isTestMode]);

  const showChat = () => {
    setState((prev) => ({ ...prev, isChatVisible: true }));
  };

  const hideChat = () => {
    setState((prev) => ({ ...prev, isChatVisible: false }));
  };

  const switchPlan = (planId: string) => {
    const newPlan = state.availablePlans.find((plan) => plan.id === planId);
    if (newPlan) {
      setState((prev) => ({ ...prev, currentPlan: newPlan }));
    }
  };

  return {
    ...state,
    showChat,
    hideChat,
    switchPlan,
  };
};
