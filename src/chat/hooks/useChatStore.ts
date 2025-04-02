// Proper Zustand implementation for Next.js
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ChatMessage, ChatSession, PlanInfo } from '../../models/chat';

/**
 * Chat store state interface
 */
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

/**
 * Create a store (this follows Zustand's recommendation for Next.js)
 * Using a factory function ensures we create a new store instance for each request
 */
const createChatStore = () =>
  create<ChatState>()(
    persist(
      (set) => ({
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
        reset: () =>
          set({
            isOpen: false,
            isLoading: false,
            messages: [],
            session: null,
            isPlanSwitcherLocked: false,
            currentPlan: null,
          }),
      }),
      {
        name: 'chat-store',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );

// Export the hook that will be used in components
let storeInstance: ReturnType<typeof createChatStore>;

// Initialize the store on the client side only
export const useChatStore = (): ChatState => {
  // For SSR, always create a new store
  if (typeof window === 'undefined') {
    return createChatStore()();
  }

  // Create the store once in the client
  if (!storeInstance) {
    storeInstance = createChatStore();
  }

  return storeInstance();
};
