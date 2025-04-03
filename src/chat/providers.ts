import { create } from 'zustand';
import { ChatMessage } from '../app/chat/models/message';
import { PlanInfo } from '../app/chat/models/plans';
import {
  ChatSession,
  ChatSessionJWT,
  ChatState,
} from '../app/chat/models/session';

export const useChatStore = create<ChatState>((set, get) => ({
  // UI State
  isOpen: false,
  isLoading: false,
  isSendingMessage: false,
  error: null,

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
    set({ session: null, isOpen: false, messages: [], error: null });
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
  setError: (error: string | null) => set({ error }),

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
      error: null,
    });
  },

  updateJWT: (jwt: ChatSessionJWT) => {
    set((state) => ({
      session: state.session ? { ...state.session, jwt } : null,
    }));
  },

  updateCurrentPlan: (plan: PlanInfo) => {
    set((state) => ({
      session: state.session ? { ...state.session, plan } : null,
    }));
  },
}));
