import { useEffect } from 'react';
import { PlanInfo } from '../../../models/chat';
import { ChatPlan } from '../models/types';
import { useChatStore } from '../stores/chatStore';

interface UsePlanSwitcherOptions {
  currentPlan: PlanInfo | null;
  availablePlans: PlanInfo[];
  openPlanSwitcher: () => void;
}

interface PlanSwitcherResult {
  isPlanSwitcherLocked: boolean;
  showSwitchPlanOption: boolean;
  handleSwitchPlan: () => void;
  currentPlanName: string | null;
  displayPlanInfo: boolean;
}

/**
 * Hook to handle integration between chat widget and plan switcher
 */
export const usePlanSwitcher = ({
  currentPlan,
  availablePlans,
  openPlanSwitcher,
}: UsePlanSwitcherOptions): PlanSwitcherResult => {
  const {
    isOpen: isChatOpen,
    messages,
    isPlanSwitcherLocked,
    lockPlanSwitcher,
    unlockPlanSwitcher,
    setCurrentPlan,
  } = useChatStore();

  // Update current plan in chat store when it changes
  useEffect(() => {
    if (currentPlan) {
      const chatPlan: ChatPlan = {
        id: currentPlan.planId,
        name: currentPlan.planName,
        isChatEligible: currentPlan.isEligibleForChat,
        lineOfBusiness: currentPlan.lineOfBusiness,
        businessHours: {
          isOpen24x7: false,
          days: [],
          timezone: 'America/New_York',
          isCurrentlyOpen: false,
        },
        termsAndConditions: '',
        isActive: true,
      };
      setCurrentPlan(chatPlan);
    }
  }, [currentPlan, setCurrentPlan]);

  // Lock plan switcher when chat is open with messages
  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      lockPlanSwitcher();
    } else {
      unlockPlanSwitcher();
    }
  }, [isChatOpen, messages, lockPlanSwitcher, unlockPlanSwitcher]);

  // Handler for switching plans from chat
  const handleSwitchPlan = () => {
    // If the chat is active (has messages), do not allow switching
    if (messages.length > 0) {
      return;
    }

    // Close the chat widget and open the plan switcher
    useChatStore.getState().closeChat();
    openPlanSwitcher();
  };

  const hasMultiplePlans = availablePlans.length > 1;

  return {
    isPlanSwitcherLocked,
    showSwitchPlanOption: hasMultiplePlans && !isPlanSwitcherLocked,
    handleSwitchPlan,
    currentPlanName: currentPlan?.planName || null,
    displayPlanInfo: hasMultiplePlans,
  };
};
