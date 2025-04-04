import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/chatStore';
import { PlanInfo } from '../types';

interface UsePlanSwitcherIntegrationOptions {
  currentPlan: PlanInfo | null;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;
  openPlanSwitcher: () => void;
  closePlanSwitcher: () => void;
}

interface PlanSwitcherIntegrationResult {
  isPlanSwitcherLocked: boolean;
  showSwitchPlanOption: boolean;
  handleSwitchPlan: () => void;
  currentPlanName: string | null;
  displayPlanInfo: boolean;
}

// Maps a PlanInfo to ChatPlan format for the store
const mapToChatPlan = (plan: PlanInfo) => {
  return {
    id: plan.id,
    name: plan.name,
    isChatEligible: plan.isEligibleForChat,
    businessHours: {
      isOpen24x7: plan.businessHours?.isOpen24x7 || false,
      days: plan.businessHours?.days || [],
      timezone: plan.businessHours?.timezone || 'America/New_York',
      isCurrentlyOpen: plan.businessHours?.isCurrentlyOpen || false,
      lastUpdated: plan.businessHours?.lastUpdated || Date.now(),
      source: plan.businessHours?.source || 'api',
    },
    // Add required fields for ChatPlan
    lineOfBusiness: 'default',
    termsAndConditions: '',
    isActive: true,
  };
};

/**
 * Hook to handle integration between chat widget and plan switcher
 */
export const usePlanSwitcherIntegration = ({
  currentPlan,
  availablePlans,
  openPlanSwitcher,
}: UsePlanSwitcherIntegrationOptions): PlanSwitcherIntegrationResult => {
  const {
    isOpen: isChatOpen,
    messages,
    isPlanSwitcherLocked,
    setCurrentPlan,
    lockPlanSwitcher,
    unlockPlanSwitcher,
    setAvailablePlans,
  } = useChatStore();

  const [hasMultiplePlans, setHasMultiplePlans] = useState(false);

  // Update current plan in chat store when it changes
  useEffect(() => {
    if (currentPlan) {
      // Map PlanInfo to ChatPlan for the store
      setCurrentPlan(mapToChatPlan(currentPlan));
    }
  }, [currentPlan, setCurrentPlan]);

  // Update available plans and track if multiple plans exist
  useEffect(() => {
    // Map all plans to ChatPlan format
    const chatPlans = availablePlans.map(mapToChatPlan);
    setAvailablePlans(chatPlans);
    setHasMultiplePlans(availablePlans.length > 1);
  }, [availablePlans, setAvailablePlans]);

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

  return {
    isPlanSwitcherLocked,
    showSwitchPlanOption: hasMultiplePlans && !isPlanSwitcherLocked,
    handleSwitchPlan,
    currentPlanName: currentPlan?.name || null,
    displayPlanInfo: hasMultiplePlans,
  };
};

export default usePlanSwitcherIntegration;
