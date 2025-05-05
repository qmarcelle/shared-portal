// src/stores/chatStore.ts
import { create } from 'zustand';
import { getChatInfo } from '../../../utils/api/ChatService';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { ChatError, ChatInfoResponse } from '../types/index';

export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  newMessageCount: number;

  // Chat state
  isChatActive: boolean;
  isLoading: boolean;
  error: ChatError | null;
  messages: Array<{ id: string; content: string; sender: 'user' | 'agent' }>;

  // API response
  eligibility: ChatInfoResponse | null;

  // Derived flags
  isEligible: boolean;
  chatMode: 'legacy' | 'cloud';
  isOOO: boolean;
  chatGroup?: string;
  businessHoursText: string;
  routingInteractionId?: string;
  userData: Record<string, string>;
  formInputs: { id: string; value: string }[];

  // Zod-validated config
  config?: ChatConfig;

  // Plan switching
  isPlanSwitcherLocked: boolean;
  planSwitcherTooltip: string;

  // Actions
  setOpen: (isOpen: boolean) => void;
  setMinimized: (min: boolean) => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  setError: (err: ChatError | null) => void;
  addMessage: (m: { content: string; sender: 'user' | 'agent' }) => void;
  clearMessages: () => void;
  setChatActive: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  setEligibility: (info: ChatInfoResponse | null) => void;
  setPlanSwitcherLocked: (locked: boolean) => void;
  updateConfig: (cfg: Partial<ChatConfig>) => void;
  closeAndRedirect: () => void;

  // New actions
  loadChatConfiguration: (memberId: number, planId: string) => Promise<void>;
  startChat: () => void;
  endChat: () => void;
}

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

  // API response
  eligibility: null,

  // Derived flags
  isEligible: false,
  chatMode: 'legacy',
  isOOO: true,
  chatGroup: undefined,
  businessHoursText: '',
  routingInteractionId: undefined,
  userData: {},
  formInputs: [],

  // Config slice
  config: undefined,

  // Plan switching
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',

  // Actions
  setOpen: (isOpen) => set({ isOpen }),
  setMinimized: (min) => set({ isMinimized: min }),
  minimizeChat: () => set({ isMinimized: true }),
  maximizeChat: () => set({ isMinimized: false }),
  setError: (error) => set({ error }),
  addMessage: (message) =>
    set((s) => ({
      messages: [...s.messages, { id: Date.now().toString(), ...message }],
    })),
  clearMessages: () => set({ messages: [] }),
  setChatActive: (active) => set({ isChatActive: active }),
  setLoading: (loading) => set({ isLoading: loading }),
  incrementMessageCount: () =>
    set((s) => ({ newMessageCount: s.newMessageCount + 1 })),
  resetMessageCount: () => set({ newMessageCount: 0 }),
  setEligibility: (eligibility) => set({ eligibility }),

  setPlanSwitcherLocked: (locked) =>
    set({
      isPlanSwitcherLocked: locked,
      planSwitcherTooltip: locked
        ? 'You cannot switch plans during an active chat session.'
        : '',
    }),

  updateConfig: (cfg) => {
    try {
      const validated = ChatConfigSchema.parse(cfg);
      set({ config: validated });
    } catch (err) {
      console.error('Invalid chat configuration:', err);
      set({
        error: new ChatError(
          'Invalid chat configuration',
          'CONFIGURATION_ERROR',
        ),
      });
    }
  },

  closeAndRedirect: () =>
    set({
      isOpen: false,
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
    }),

  // New actions
  loadChatConfiguration: async (memberId, planId) => {
    const info = await getChatInfo(memberId, planId);
    set({
      eligibility: info,
      isEligible: info.isEligible,
      chatMode: info.cloudChatEligible ? 'cloud' : 'legacy',
      chatGroup: info.chatGroup,
      isOOO: !info.businessHours?.isOpen,
      businessHoursText: info.businessHours?.text || '',
      routingInteractionId: info.RoutingChatbotInteractionId,
      userData: {
        MEMBER_ID: String(info.member_ck),
        PLAN_ID: planId,
        firstname: info.first_name,
        lastname: info.last_name,
        LOB: info.lob_group,
        IDCardBotName: info.IDCardBotName || '',
      },
      formInputs: [
        { id: 'MEMBER_ID', value: String(info.member_ck) },
        { id: 'PLAN_ID', value: planId },
        { id: 'firstname', value: info.first_name },
        { id: 'lastname', value: info.last_name },
        { id: 'LOB', value: info.lob_group },
      ],
    });
  },

  startChat: () => set({ isChatActive: true }),
  endChat: () => set({ isChatActive: false }),
}));
