import { create } from 'zustand';
import { ChatMessage, ChatSession, PlanInfo } from '../../../../models/chat';

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
}

// Create the mock store
export const useChatStore = create<ChatState>()((set) => ({
  // Initial state
  isOpen: false,
  isLoading: false,
  messages: [],
  session: null,
  isPlanSwitcherLocked: false,
  currentPlan: null,

  // Actions
  setOpen: (isOpen) => set({ isOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
  unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),
  updateCurrentPlan: (plan) => set({ currentPlan: plan }),
}));
