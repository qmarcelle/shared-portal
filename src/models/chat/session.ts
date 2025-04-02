import { PlanInfo } from './plans';

/**
 * Chat payload for API requests
 */
export interface ChatPayload {
  memberClientID: string;
  userID: string;
  planId: string;
  message?: string;
}

/**
 * User eligibility for chat
 */
export interface ChatEligibility {
  isEligible: boolean;
  reason?: string;
}

/**
 * Plan switcher state
 */
export interface PlanSwitcherState {
  isPlanSwitcherLocked: boolean;
  currentPlan: PlanInfo | null;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
}
