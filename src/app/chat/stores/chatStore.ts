/**
 * Chat Store
 *
 * This file manages the global state for the chat system using Zustand.
 * It handles:
 * - Chat session state
 * - UI state
 * - Plan eligibility
 * - Business hours
 * - Message history
 */

import { create } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';
import {
  BusinessDay,
  BusinessHours,
  ChatError,
  ChatMessage,
  ChatPlan,
  ChatSession,
  ChatState,
} from '../models/types';

// Define the store name for persistence
const STORE_NAME = 'chat-store';

// Extended store interface with additional state and actions
interface ExtendedChatState extends ChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  isTransitioning: boolean;
  isSendingMessage: boolean;
  isLoading: boolean;
  error: ChatError | null;

  // Session State
  session: ChatSession | null;
  messages: ChatMessage[];
  lastMessageId: string | null;

  // Genesys Integration
  isChatActive: boolean;
  isWithinBusinessHours: boolean;
  currentPlan: ChatPlan | null;
  isPlanSwitcherLocked: boolean;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  startChat: () => void;
  endChat: () => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setError: (error: ChatError | null) => void;
  setCurrentPlan: (plan: ChatPlan | null) => void;
  setAvailablePlans: (plans: ChatPlan[]) => void;
  setBusinessHours: (hours: BusinessHours) => void;
  setEligibility: (eligibility: ChatState['eligibility']) => void;
  setIsPlanSwitchingLocked: (locked: boolean) => void;
  setSendingMessage: (isSending: boolean) => void;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  reset: () => void;
}

type ChatStorePersist = Pick<
  ExtendedChatState,
  | 'isOpen'
  | 'isMinimized'
  | 'currentPlan'
  | 'availablePlans'
  | 'businessHours'
  | 'eligibility'
>;

const persistOptions: PersistOptions<ExtendedChatState, ChatStorePersist> = {
  name: STORE_NAME,
  partialize: (state) => ({
    isOpen: state.isOpen,
    isMinimized: state.isMinimized,
    currentPlan: state.currentPlan,
    availablePlans: state.availablePlans,
    businessHours: state.businessHours,
    eligibility: state.eligibility,
  }),
};

// Create the store with middleware for development tools and persistence
export const useChatStore = create<ExtendedChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        isOpen: false,
        isMinimized: false,
        isTransitioning: false,
        isSendingMessage: false,
        isLoading: false,
        error: null,

        // Messages State
        messages: [],
        lastMessageId: null,

        // Session State
        session: null,

        // Genesys Integration
        isChatActive: false,
        isWithinBusinessHours: false,
        currentPlan: null,
        isPlanSwitcherLocked: false,

        // Initial State
        isActive: false,
        isPlanSwitchingLocked: false,
        availablePlans: [],
        businessHours: {
          isOpen24x7: false,
          days: [] as BusinessDay[],
          timezone: 'America/New_York',
          isCurrentlyOpen: false,
          lastUpdated: Date.now(),
          source: 'api',
        },
        eligibility: {
          isChatEligibleMember: false,
          isDemoMember: false,
          isAmplifyMem: false,
          groupId: '',
          memberClientID: '',
          getGroupType: '',
          isBlueEliteGroup: false,
          isMedical: false,
          isDental: false,
          isVision: false,
          isWellnessOnly: false,
          isCobraEligible: false,
          chatHours: '',
          rawChatHours: '',
          isChatbotEligible: false,
          memberMedicalPlanID: '',
          isIDCardEligible: false,
          memberDOB: '',
          subscriberID: '',
          sfx: '',
          memberFirstname: '',
          memberLastName: '',
          userID: '',
          isChatAvailable: false,
          routingchatbotEligible: false,
        },

        // Actions
        openChat: () => set({ isOpen: true }),
        closeChat: () => set({ isOpen: false }),
        minimizeChat: () => set({ isMinimized: true }),
        maximizeChat: () => set({ isMinimized: false }),
        startChat: () => {
          const { currentPlan } = get();
          if (!currentPlan) return;
          set({ isChatActive: true });
        },
        endChat: () => set({ isChatActive: false }),
        addMessage: (message) =>
          set((state) => ({ messages: [...state.messages, message] })),
        clearMessages: () => set({ messages: [] }),
        setError: (error) => set({ error }),
        setCurrentPlan: (plan) => set({ currentPlan: plan }),
        setAvailablePlans: (plans) => set({ availablePlans: plans }),
        setBusinessHours: (hours) => set({ businessHours: hours }),
        setEligibility: (eligibility) => set({ eligibility }),
        setIsPlanSwitchingLocked: (locked) =>
          set({ isPlanSwitcherLocked: locked }),
        setSendingMessage: (isSending) => set({ isSendingMessage: isSending }),
        lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
        unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),
        reset: () =>
          set({
            isOpen: false,
            isMinimized: false,
            isTransitioning: false,
            isSendingMessage: false,
            isLoading: false,
            error: null,
            messages: [],
            lastMessageId: null,
            session: null,
            isChatActive: false,
            isWithinBusinessHours: false,
            currentPlan: null,
            isPlanSwitcherLocked: false,
            isActive: false,
            isPlanSwitchingLocked: false,
            availablePlans: [],
            businessHours: {
              isOpen24x7: false,
              days: [] as BusinessDay[],
              timezone: 'America/New_York',
              isCurrentlyOpen: false,
              lastUpdated: Date.now(),
              source: 'api',
            },
            eligibility: {
              isChatEligibleMember: false,
              isDemoMember: false,
              isAmplifyMem: false,
              groupId: '',
              memberClientID: '',
              getGroupType: '',
              isBlueEliteGroup: false,
              isMedical: false,
              isDental: false,
              isVision: false,
              isWellnessOnly: false,
              isCobraEligible: false,
              chatHours: '',
              rawChatHours: '',
              isChatbotEligible: false,
              memberMedicalPlanID: '',
              isIDCardEligible: false,
              memberDOB: '',
              subscriberID: '',
              sfx: '',
              memberFirstname: '',
              memberLastName: '',
              userID: '',
              isChatAvailable: false,
              routingchatbotEligible: false,
            },
          }),
      }),
      persistOptions,
    ),
  ),
);

/**
 * Hook to handle SSR hydration of the chat store
 * Ensures the store is properly initialized on the client side
 */
export const useHydratedChatStore = () => {
  return useChatStore((state) => state);
};
