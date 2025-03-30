import { create } from 'zustand';
import { ChatMessage, CobrowseState, PlanInfo } from '../models/chat';
import { checkChatHours } from './chatHours';

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isChatAvailable: boolean;
  isWithinHours: boolean;
  selectedTopic: string | null;
  showingDisclaimer: boolean;
  cobrowseState: CobrowseState;
  sessionToken: string | null;

  // Plan switching related state
  isPlanSwitcherLocked: boolean;
  currentPlan: PlanInfo | null;
  hasMultiplePlans: boolean;

  // Actions
  setOpen: (isOpen: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  checkChatHours: (rawChatHours: string) => void;
  setTopic: (topic: string) => void;
  showDisclaimer: () => void;
  hideDisclaimer: () => void;
  setCobrowseState: (state: CobrowseState) => void;
  setSessionToken: (token: string | null) => void;
  reset: () => void;

  // Plan switching related actions
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  updateCurrentPlan: (plan: PlanInfo) => void;
  setHasMultiplePlans: (hasMultiple: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => {
  // Initial state
  const initialState = {
    isOpen: false,
    messages: [],
    isChatAvailable: false,
    isWithinHours: true,
    selectedTopic: null,
    showingDisclaimer: false,
    cobrowseState: 'inactive' as CobrowseState,
    sessionToken: null,

    // Plan switching initial state
    isPlanSwitcherLocked: false,
    currentPlan: null,
    hasMultiplePlans: false,
  };

  return {
    ...initialState,

    setOpen: (isOpen) => set({ isOpen }),

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...message,
          },
        ],
      })),

    checkChatHours: (rawChatHours) => {
      const isWithinHours = checkChatHours(rawChatHours);
      set({ isWithinHours });
    },

    setTopic: (topic) => set({ selectedTopic: topic }),
    showDisclaimer: () => set({ showingDisclaimer: true }),
    hideDisclaimer: () => set({ showingDisclaimer: false }),
    setCobrowseState: (state) => set({ cobrowseState: state }),
    setSessionToken: (token) => set({ sessionToken: token }),

    // Plan switching actions
    lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
    unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),
    updateCurrentPlan: (plan) => set({ currentPlan: plan }),
    setHasMultiplePlans: (hasMultiple) =>
      set({ hasMultiplePlans: hasMultiple }),

    // Reset for testing purposes
    reset: () => set(initialState),
  };
});
