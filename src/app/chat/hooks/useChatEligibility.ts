import { useEffect, useState } from 'react';
import { PlanInfo } from '../../../models/chat';
import { checkChatHours } from '../../../services/chat/utils/chatHours';

interface UseChatEligibilityOptions {
  currentPlan: PlanInfo | null;
}

interface ChatEligibilityResult {
  isEligible: boolean;
  isWithinHours: boolean;
  currentPlan: PlanInfo | null;
  reason: 'eligible' | 'plan-ineligible' | 'outside-hours' | 'no-plan';
}

/**
 * Hook to determine if chat is eligible based on the current plan and business hours
 */
export const useChatEligibility = ({
  currentPlan,
}: UseChatEligibilityOptions): ChatEligibilityResult => {
  const [eligibility, setEligibility] = useState<ChatEligibilityResult>({
    isEligible: false,
    isWithinHours: false,
    currentPlan: null,
    reason: 'no-plan',
  });

  useEffect(() => {
    if (!currentPlan) {
      setEligibility({
        isEligible: false,
        isWithinHours: false,
        currentPlan: null,
        reason: 'no-plan',
      });
      return;
    }

    // Check if the plan is eligible for chat
    if (!currentPlan.isEligibleForChat) {
      setEligibility({
        isEligible: false,
        isWithinHours: false,
        currentPlan,
        reason: 'plan-ineligible',
      });
      return;
    }

    // Check if current time is within business hours
    const isWithinHours = currentPlan.businessHours
      ? checkChatHours(currentPlan.businessHours)
      : true; // Default to true if no business hours specified

    setEligibility({
      isEligible: isWithinHours,
      isWithinHours,
      currentPlan,
      reason: isWithinHours ? 'eligible' : 'outside-hours',
    });
  }, [currentPlan]);

  return eligibility;
};
