import { create } from 'zustand';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { ChatError, ChatInfoResponse } from '../types/index';

/**
 * Chat store state interface-
 */
export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  newMessageCount: number;

  // Chat state
  isChatActive: boolean;
  isLoading: boolean;
  error: ChatError | null;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
  }>;

  // Eligibility state
  eligibility: ChatInfoResponse | null;

  // Plan switching
  isPlanSwitcherLocked: boolean;
  planSwitcherTooltip: string;

  // Actions
  setOpen: (isOpen: boolean) => void;
  setMinimized: (isMinimized: boolean) => void;
  setError: (error: ChatError | null) => void;
  addMessage: (message: { content: string; sender: 'user' | 'agent' }) => void;
  clearMessages: () => void;
  setChatActive: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  setEligibility: (eligibility: ChatState['eligibility']) => void;
  setPlanSwitcherLocked: (locked: boolean) => void;
  updateConfig: (config: Partial<ChatConfig>) => void;
  closeAndRedirect: () => void;
}

/**
 * Create the chat store with Zustand
 */
export const useChatStore = create<ChatState>((set) => ({
  // UI state
  isOpen: false,
  isMinimized: false,
  newMessageCount: 0,

  // Chat state
  isChatActive: false,
  isLoading: true,
  error: null,
  messages: [],

  // Eligibility state
  eligibility: null,

  // Plan switching
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',

  // Actions
  setOpen: (isOpen) => set({ isOpen }),

  setMinimized: (isMinimized) => set({ isMinimized }),

  setError: (error) => set({ error }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          content: message.content,
          sender: message.sender,
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),

  setChatActive: (active) => set({ isChatActive: active }),

  setLoading: (loading) => set({ isLoading: loading }),

  incrementMessageCount: () =>
    set((state) => ({
      newMessageCount: state.newMessageCount + 1,
    })),

  resetMessageCount: () => set({ newMessageCount: 0 }),

  setEligibility: (eligibility) => set({ eligibility }),

  setPlanSwitcherLocked: (locked) =>
    set({
      isPlanSwitcherLocked: locked,
      planSwitcherTooltip: locked
        ? 'You cannot switch plans during an active chat session.'
        : '',
    }),

  updateConfig: (config) => {
    try {
      const validatedConfig = ChatConfigSchema.parse(config);
      set((state) => ({
        eligibility: {
          ...state.eligibility,
          isEligible: true,
          chatAvailable: !!validatedConfig.isChatAvailable,
          cloudChatEligible: !!validatedConfig.cloudChatEligible,
          chatGroup: validatedConfig.chatGroup || '',
          workingHours: validatedConfig.workingHours || '',
          businessHours: {
            text: validatedConfig.workingHours || '',
            isOpen: !!validatedConfig.isChatAvailable,
          },
        },
      }));
    } catch (error) {
      console.error('Invalid chat configuration:', error);
      set({
        error: new ChatError(
          'Invalid chat configuration',
          'CONFIGURATION_ERROR',
        ),
      });
    }
  },

  closeAndRedirect: () =>
    set((state) => ({
      isOpen: false,
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
    })),
}));
