import type {
  ChatDataPayload,
  ChatInfoResponse,
  ChatSession,
  ChatState,
  PlanInfo,
} from '@/app/chat/types/index';
import { ChatError } from '@/app/chat/types/index';
import { create } from 'zustand';

/**
 * Chat store interface defining the state and actions for chat functionality.
 * Manages chat session state, messages, plan information, and error handling.
 */
interface ChatStore extends ChatState {
  // State
  /** Whether the chat window is open */
  isOpen: boolean;
  /** Whether there is an active chat session */
  isInChat: boolean;
  /** Array of chat messages */
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: number;
  }>;
  /** Current plan information */
  currentPlan: PlanInfo | null;
  /** Current error state */
  error: ChatError | null;
  /** Whether plan switching is locked during active chat */
  isPlanSwitcherLocked: boolean;
  /** Current chat session information */
  session: ChatSession | null;

  // Actions
  /** Opens the chat window */
  openChat: () => void;
  /** Closes the chat window */
  closeChat: () => void;
  /** Starts a new chat session */
  startChat: (payload: ChatDataPayload) => Promise<void>;
  /** Ends the current chat session */
  endChat: () => Promise<void>;
  /** Sends a message in the current chat session */
  sendMessage: (text: string) => Promise<void>;
  /** Retrieves chat availability and configuration */
  getChatInfo: () => Promise<ChatInfoResponse>;
  /** Sets the current error state */
  setError: (error: ChatError | null) => void;
}

/**
 * Creates and exports the chat store using Zustand.
 * Provides a global state management solution for chat functionality.
 */
export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  isOpen: false,
  isInChat: false,
  messages: [],
  currentPlan: null,
  error: null,
  isPlanSwitcherLocked: false,
  session: null,

  // Actions
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  startChat: async (payload) => {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new ChatError('Failed to start chat', 'CHAT_START_ERROR');
      set({ isInChat: true, isOpen: true });
    } catch (error) {
      throw error instanceof ChatError
        ? error
        : new ChatError('Failed to start chat', 'CHAT_START_ERROR');
    }
  },

  endChat: async () => {
    try {
      const response = await fetch('/api/chat/end', { method: 'POST' });
      if (!response.ok)
        throw new ChatError('Failed to end chat', 'CHAT_END_ERROR');
      set({ isInChat: false, isOpen: false });
    } catch (error) {
      throw error instanceof ChatError
        ? error
        : new ChatError('Failed to end chat', 'CHAT_END_ERROR');
    }
  },

  sendMessage: async (text) => {
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok)
        throw new ChatError('Failed to send message', 'MESSAGE_ERROR');
    } catch (error) {
      throw error instanceof ChatError
        ? error
        : new ChatError('Failed to send message', 'MESSAGE_ERROR');
    }
  },

  getChatInfo: async () => {
    try {
      const response = await fetch('/api/chat/info');
      if (!response.ok)
        throw new ChatError('Failed to get chat info', 'INITIALIZATION_ERROR');
      return await response.json();
    } catch (error) {
      throw error instanceof ChatError
        ? error
        : new ChatError('Failed to get chat info', 'INITIALIZATION_ERROR');
    }
  },

  setError: (error) => set({ error }),
}));

export const createChatStore = (initialState: Partial<ChatState> = {}) => ({
  isOpen: false,
  isInChat: false,
  messages: [],
  currentPlan: null,
  error: null,
  isPlanSwitcherLocked: false,
  session: null,
  ...initialState,
});
