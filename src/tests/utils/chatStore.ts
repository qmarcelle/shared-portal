import { ChatMessage, ChatSession, PlanInfo } from '../../models/chat';

// Mock chat store for testing
export interface ChatState {
  // UI state
  isOpen: boolean;
  isLoading: boolean;

  // Messages state
  messages: ChatMessage[];

  // Session state
  session: ChatSession | null;

  // Plan switching state
  isPlanSwitcherLocked: boolean;
  currentPlan: PlanInfo | null;

  // Actions
  setOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
  reset: () => void;
}

// Create the mock store
export const useChatStore = jest.fn();

// Default implementation
useChatStore.mockImplementation(() => ({
  // Initial state
  isOpen: false,
  isLoading: false,
  messages: [],
  session: null,
  isPlanSwitcherLocked: false,
  currentPlan: null,

  // Mock actions
  setOpen: jest.fn(),
  setLoading: jest.fn(),
  addMessage: jest.fn(),
  lockPlanSwitcher: jest.fn(),
  unlockPlanSwitcher: jest.fn(),
  updateCurrentPlan: jest.fn(),
  reset: jest.fn(),
}));
