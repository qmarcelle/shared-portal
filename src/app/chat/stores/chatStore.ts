/**
 * Unified Chat Store
 * Implements optimized state management with feature-based slices
 */

import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ChatError } from '../types/errors';
import type {
  BusinessHours,
  ChatMessage,
  ChatPlan,
  ChatSession,
  ChatSessionJWT,
} from '../types/types';

// Slice Types
interface SessionSlice {
  session: Session | null;
  chatJWT: ChatSessionJWT | null;
  isAuthenticated: boolean;
  isExpired: boolean;
  initializeSession: () => Promise<void>;
  clearSession: () => void;
  checkExpiration: () => boolean;
}

interface UISlice {
  isOpen: boolean;
  isMinimized: boolean;
  isTransitioning: boolean;
  isSendingMessage: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  openChat: () => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface ChatSlice {
  messages: ChatMessage[];
  lastMessageId: string | null;
  currentPlan: ChatPlan | null;
  isPlanSwitcherLocked: boolean;
  error: ChatError | null;
  chatSession: ChatSession | null;
  businessHours: BusinessHours | null;
  startChat: () => Promise<void>;
  endChat: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setError: (error: ChatError | null) => void;
  lockPlanSwitcher: () => void;
  unlockPlanSwitcher: () => void;
  setSession: (session: ChatSession | null) => void;
  setBusinessHours: (hours: BusinessHours) => void;
}

// Create Session Slice
const createSessionSlice: StateCreator<
  ExtendedChatState,
  [],
  [],
  SessionSlice
> = (set, get) => ({
  session: null,
  chatJWT: null,
  isAuthenticated: false,
  isExpired: false,
  initializeSession: async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        throw new ChatError(
          'Missing required chat session data',
          'INITIALIZATION_ERROR',
          'error',
        );
      }
      const chatJWT: ChatSessionJWT = {
        planId: (session.user as any).planId || '',
        userID: session.user.id,
        userRole: (session.user as any).role || 'member',
        groupId: (session.user as any).groupId,
        subscriberId: (session.user as any).subscriberId,
        currUsr: (session.user as any).currUsr,
      };

      set({
        session,
        chatJWT,
        isAuthenticated: true,
        isExpired: false,
        error: null,
      });
    } catch (error) {
      set({ error: ChatError.fromError(error, 'INITIALIZATION_ERROR') });
    }
  },
  clearSession: () =>
    set({
      session: null,
      chatJWT: null,
      isAuthenticated: false,
      isExpired: false,
    }),
  checkExpiration: () => {
    const { session } = get();
    const isExpired = !session || new Date(session.expires) < new Date();
    set({ isExpired });
    return isExpired;
  },
});

// Create UI Slice with Theme Support
const createUISlice: StateCreator<ExtendedChatState, [], [], UISlice> = (
  set,
) => ({
  isOpen: false,
  isMinimized: false,
  isTransitioning: false,
  isSendingMessage: false,
  isLoading: false,
  theme: 'light',
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  minimizeChat: () => set({ isMinimized: true }),
  maximizeChat: () => set({ isMinimized: false }),
  setTheme: (theme) => set({ theme }),
});

// Create Chat Slice with Enhanced Features
const createChatSlice: StateCreator<ExtendedChatState, [], [], ChatSlice> = (
  set,
  get,
) => ({
  messages: [],
  lastMessageId: null,
  currentPlan: null,
  isPlanSwitcherLocked: false,
  error: null,
  chatSession: null,
  businessHours: null,
  startChat: async () => {
    const { chatJWT, currentPlan } = get();
    if (!chatJWT || !currentPlan) {
      throw new ChatError(
        'Cannot start chat without authentication',
        'AUTH_ERROR',
        'error',
      );
    }
    set({ isLoading: true });
    try {
      // Chat initialization logic
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: ChatError.fromError(error, 'CHAT_START_ERROR'),
      });
    }
  },
  endChat: async () => {
    set({ isLoading: true });
    try {
      set({ messages: [], lastMessageId: null });
    } catch (error) {
      set({
        isLoading: false,
        error: ChatError.fromError(error, 'CHAT_END_ERROR'),
      });
    }
  },
  sendMessage: async (message: string) => {
    set({ isSendingMessage: true });
    try {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: message,
        sender: 'user',
        timestamp: Date.now(),
      };
      get().addMessage(newMessage);
      set({ isSendingMessage: false });
    } catch (error) {
      set({
        isSendingMessage: false,
        error: ChatError.fromError(error, 'MESSAGE_ERROR'),
      });
    }
  },
  addMessage: (message: ChatMessage) => {
    const { messages } = get();
    set({
      messages: [...messages, message],
      lastMessageId: message.id,
    });
  },
  clearMessages: () => set({ messages: [], lastMessageId: null }),
  setError: (error: ChatError | null) => set({ error }),
  lockPlanSwitcher: () => set({ isPlanSwitcherLocked: true }),
  unlockPlanSwitcher: () => set({ isPlanSwitcherLocked: false }),
  setSession: (session: ChatSession | null) => set({ chatSession: session }),
  setBusinessHours: (hours: BusinessHours) => set({ businessHours: hours }),
});

// Create the unified store with all slices
export const useChatStore = create<ExtendedChatState>()(
  devtools(
    persist(
      subscribeWithSelector((...args) => ({
        ...createSessionSlice(...args),
        ...createUISlice(...args),
        ...createChatSlice(...args),
      })),
      {
        name: 'chat-store',
        partialize: (state) => ({
          session: state.session,
          chatJWT: state.chatJWT,
          currentPlan: state.currentPlan,
          theme: state.theme,
          messages: state.messages,
        }),
      },
    ),
  ),
);

// Optimized selector hooks
export const useChatSession = () =>
  useChatStore(
    (state) => ({
      session: state.session,
      chatJWT: state.chatJWT,
      isAuthenticated: state.isAuthenticated,
      isExpired: state.isExpired,
    }),
    shallow,
  );

export const useChatUI = () =>
  useChatStore(
    (state) => ({
      isOpen: state.isOpen,
      isMinimized: state.isMinimized,
      isTransitioning: state.isTransitioning,
      isSendingMessage: state.isSendingMessage,
      isLoading: state.isLoading,
      theme: state.theme,
    }),
    shallow,
  );

export const useChatState = () =>
  useChatStore(
    (state) => ({
      messages: state.messages,
      lastMessageId: state.lastMessageId,
      currentPlan: state.currentPlan,
      error: state.error,
      chatSession: state.chatSession,
      businessHours: state.businessHours,
    }),
    shallow,
  );

// Export types
export type { ChatSlice, SessionSlice, UISlice };
export interface ExtendedChatState extends SessionSlice, UISlice, ChatSlice {}
