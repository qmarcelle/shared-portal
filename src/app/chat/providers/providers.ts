import { create } from 'zustand';
import { ChatMessage } from '../models/chat/message';
import { PlanInfo } from '../models/chat/plans';
import { ChatSession, ChatSessionJWT, ChatState } from '../models/chat/session';

export const useChatStore = create<ChatState>((set, get) => ({
  // UI State
  isOpen: false,
  isLoading: false,
  isSendingMessage: false,

  // Messages State
  messages: [],

  // Session State
  session: null,

  // Plan Switching State
  isPlanSwitcherLocked: false,

  // Actions
  openChat: () => set({ isOpen: true }),
  closeChat: () => {
    const { session } = get();
    if (session) {
      // Close the chat session on the server
      fetch('/api/chat/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: session.id }),
      }).catch(console.error);
    }
    set({ session: null, isOpen: false, messages: [] });
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setSession: (session: ChatSession | null) => set({ session }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setSendingMessage: (isSending: boolean) =>
    set({ isSendingMessage: isSending }),

  lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
  unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),

  reset: () => {
    const { session } = get();
    if (session) {
      // Close the chat session on the server
      fetch('/api/chat/close', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: session.id }),
      }).catch(console.error);
    }
    set({
      isOpen: false,
      isLoading: false,
      isSendingMessage: false,
      messages: [],
      session: null,
      isPlanSwitcherLocked: false,
    });
  },

  updateJWT: (jwt: ChatSessionJWT) => {
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          jwt,
        },
      });
    }
  },

  updateCurrentPlan: (plan: PlanInfo) => {
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          jwt: {
            ...session.jwt,
            planId: plan.planId,
          },
        },
      });
    }
  },
}));
