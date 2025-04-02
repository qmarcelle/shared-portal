import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';
import { createStore, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession, PlanInfo } from '../../models/chat';

/**
 * Chat store state interface
 */
export interface ChatState {
  // UI state
  isOpen: boolean;
  isLoading: boolean;
  showPlanSwitcherMessage: boolean;
  showCobrowseConsent: boolean;
  cobrowseSessionCode: string | null;

  // Messages state
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;

  // Session state
  session: ChatSession | null;
  isInitializing: boolean;
  isWithinBusinessHours: boolean;

  // Plan switching state
  isPlanSwitcherLocked: boolean;
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

/**
 * Create the default store creator
 */
const createChatStore = () =>
  createStore<ChatState>()(
    persist(
      (set, get) => ({
        // Initial state
        isOpen: false,
        isLoading: false,
        showPlanSwitcherMessage: false,
        showCobrowseConsent: false,
        cobrowseSessionCode: null,
        messages: [],
        isSending: false,
        error: null,
        session: null,
        isInitializing: false,
        isWithinBusinessHours: true,
        isPlanSwitcherLocked: false,
        currentPlan: null,
        availablePlans: [],
        isPlanSwitcherOpen: false,

        // Actions
        openChat: () => set({ isOpen: true }),
        closeChat: () => {
          set({
            isOpen: false,
            messages: [],
            session: null,
            error: null,
            isPlanSwitcherLocked: false,
            showPlanSwitcherMessage: false,
          });
          get().unlockPlanSwitcher();
        },
        addMessage: (message) =>
          set((state) => ({
            messages: [...state.messages, message],
            isSending: false,
            error: null,
          })),
        clearMessages: () => set({ messages: [] }),
        setError: (error) => set({ error, isSending: false }),
        initializeSession: async (planId) => {
          set({ isInitializing: true, error: null });
          try {
            // API call to initialize chat session
            const response = await fetch('/api/v1/chat/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ planId }),
            });

            if (!response.ok)
              throw new Error('Failed to initialize chat session');

            const session = await response.json();
            set({
              session,
              isInitializing: false,
              isPlanSwitcherLocked: true,
            });
            get().lockPlanSwitcher();
          } catch (error) {
            set({
              error: 'Failed to start chat session. Please try again.',
              isInitializing: false,
            });
          }
        },
        endSession: () => {
          set({
            session: null,
            messages: [],
            isPlanSwitcherLocked: false,
            showPlanSwitcherMessage: false,
          });
          get().unlockPlanSwitcher();
        },
        setCurrentPlan: (plan) => set({ currentPlan: plan }),
        setAvailablePlans: (plans) => set({ availablePlans: plans }),
        openPlanSwitcher: () => set({ isPlanSwitcherOpen: true }),
        closePlanSwitcher: () => set({ isPlanSwitcherOpen: false }),
        lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
        unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),
        setShowPlanSwitcherMessage: (show) =>
          set({ showPlanSwitcherMessage: show }),
        setCobrowseSessionCode: (code) => set({ cobrowseSessionCode: code }),
        setShowCobrowseConsent: (show) => set({ showCobrowseConsent: show }),
        setBusinessHours: (isOpen) => set({ isWithinBusinessHours: isOpen }),
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          currentPlan: state.currentPlan,
          availablePlans: state.availablePlans,
        }),
      },
    ),
  );

// Create a context to hold the store
type ChatStoreContext = {
  store: StoreApi<ChatState>;
};

const StoreContext = createContext<ChatStoreContext | null>(null);

/**
 * Provider component that makes the chat store available to any child component that calls useChatStore().
 */
export function ChatStoreProvider({ children }: PropsWithChildren) {
  // Create the store only once
  const storeRef = useRef<StoreApi<ChatState>>();

  if (!storeRef.current) {
    storeRef.current = createChatStore();
  }

  return (
    <StoreContext.Provider value={{ store: storeRef.current }}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook that enables components to access and subscribe to the chat store.
 * This follows the recommended pattern for using Zustand with Next.js.
 */
export function useChatStore<T>(selector: (state: ChatState) => T): T {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useChatStore must be used within a ChatStoreProvider');
  }

  // Use Zustand's useStore hook to subscribe to the store with the selector
  return useStore(context.store, selector);
}

/**
 * Simplified version of Zustand's useStore hook for use with our context-based approach
 */
function useStore<T>(
  store: StoreApi<ChatState>,
  selector: (state: ChatState) => T,
): T {
  const [state, setState] = React.useState<T>(() => selector(store.getState()));

  React.useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const selectedState = selector(newState);
      setState(selectedState);
    });

    return unsubscribe;
  }, [store, selector]);

  return state;
}
