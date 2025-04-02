import { ChatMessage, ChatSession, PlanInfo } from '../../models/chat';

// Mock chat store for testing
interface ChatState {
  // UI State
  isOpen: boolean;
  isPlanSwitcherLocked: boolean;
  showPlanSwitcherMessage: boolean;
  showCobrowseConsent: boolean;
  cobrowseSessionCode: string | null;

  // Messages State
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;

  // Session State
  session: ChatSession | null;
  isInitializing: boolean;
  isWithinBusinessHours: boolean;

  // Plan Switching State
  currentPlan: PlanInfo | null;
  availablePlans: PlanInfo[];
  isPlanSwitcherOpen: boolean;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  initializeSession: (planId: string) => Promise<void>;
  endSession: () => void;
  setCurrentPlan: (plan: PlanInfo) => void;
  setAvailablePlans: (plans: PlanInfo[]) => void;
  openPlanSwitcher: () => void;
  closePlanSwitcher: () => void;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  setShowPlanSwitcherMessage: (show: boolean) => void;
  setCobrowseSessionCode: (code: string | null) => void;
  setShowCobrowseConsent: (show: boolean) => void;
  setBusinessHours: (isOpen: boolean) => void;
}

const mockChatStore = jest.fn<ChatState, []>(() => ({
  // Initial State
  isOpen: false,
  isPlanSwitcherLocked: false,
  showPlanSwitcherMessage: false,
  showCobrowseConsent: false,
  cobrowseSessionCode: null,
  messages: [],
  isSending: false,
  error: null,
  session: null,
  isInitializing: false,
  isWithinBusinessHours: true,
  currentPlan: null,
  availablePlans: [],
  isPlanSwitcherOpen: false,

  // Actions
  openChat: jest.fn(),
  closeChat: jest.fn(),
  addMessage: jest.fn(),
  clearMessages: jest.fn(),
  setError: jest.fn(),
  initializeSession: jest.fn(),
  endSession: jest.fn(),
  setCurrentPlan: jest.fn(),
  setAvailablePlans: jest.fn(),
  openPlanSwitcher: jest.fn(),
  closePlanSwitcher: jest.fn(),
  lockPlanSwitcher: jest.fn(),
  unlockPlanSwitcher: jest.fn(),
  setShowPlanSwitcherMessage: jest.fn(),
  setCobrowseSessionCode: jest.fn(),
  setShowCobrowseConsent: jest.fn(),
  setBusinessHours: jest.fn(),
}));

export const useChatStore = mockChatStore;
