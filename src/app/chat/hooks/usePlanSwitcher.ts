import { useEffect } from 'react';
import { PlanInfo } from '../../../models/chat';
import { useChatStore } from '../stores/chatStore';

interface UsePlanSwitcherOptions {
  currentPlan: PlanInfo | null;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;
  openPlanSwitcher: () => void;
  closePlanSwitcher: () => void;
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
  isPlanSwitcherOpen,
  openPlanSwitcher,
  closePlanSwitcher,
}: UsePlanSwitcherOptions): PlanSwitcherResult => {
  const {
    isOpen: isChatOpen,
    messages,
    isPlanSwitcherLocked,
    lockPlanSwitcher,
    unlockPlanSwitcher,
    updateCurrentPlan,
  } = useChatStore();

  // Update current plan in chat store when it changes
  useEffect(() => {
    if (currentPlan) {
      updateCurrentPlan(currentPlan);
    }
  }, [currentPlan, updateCurrentPlan]);

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
    useChatStore.getState().setOpen(false);
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
