import { ChatMessage } from './message';
import { PlanInfo } from './plans';

/**
 * JWT information for chat sessions
 */
export interface ChatSessionJWT {
  token?: string;
  planId: string;
  expiresAt?: number;
  userID?: string;
  userId?: string;
  userRole?: string;
  groupId?: string;
  subscriberId?: string;
}

export interface ChatSession {
  id: string;
  startTime: string;
  isActive: boolean;
  jwt?: ChatSessionJWT;
}

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

export interface ChatState {
  // UI State
  isOpen: boolean;
  isLoading: boolean;
  isSendingMessage: boolean;
  error: string | null;

  // Messages State
  messages: ChatMessage[];

  // Session State
  session: ChatSession | null;

  // Plan Switching State
  isPlanSwitcherLocked: boolean;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: ChatMessage) => void;
  setSession: (session: ChatSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setSendingMessage: (isSending: boolean) => void;
  setError: (error: string | null) => void;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  reset: () => void;
  updateJWT: (jwt: ChatSessionJWT) => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
}
