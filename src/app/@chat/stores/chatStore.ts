// src/stores/chatStore.ts
import { create } from 'zustand';
import {
  ChatInfoResponse,
  memberService,
} from '../../../utils/api/memberService';
// import { ChatError } from '../types/index'; // Commented out due to missing file
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';

export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  newMessageCount: number;

  // Chat state
  isChatActive: boolean;
  isLoading: boolean;
  error: Error | null;
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
  setError: (err: Error | null) => void;
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
        error: new Error('Invalid chat configuration'),
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
    try {
      set({ isLoading: true, error: null });
      const response = await memberService.get('/chat/info', {
        params: { memberId, planId },
      });
      const info = response.data as ChatInfoResponse;
      set({
        eligibility: info,
        isEligible: info.isEligible,
        chatMode: info.cloudChatEligible ? 'cloud' : 'legacy',
        chatGroup: info.chatGroup,
        isOOO: !info.businessHours?.isOpen,
        businessHoursText: info.businessHours?.text || '',
        routingInteractionId: info.RoutingChatbotInteractionId,
        userData: {
          SERV_Type: info.SERV_Type,
          firstname: info.first_name,
          lastname: info.last_name,
          RoutingChatbotInteractionId: info.RoutingChatbotInteractionId,
          PLAN_ID: planId,
          GROUP_ID: info.GROUP_ID,
          IDCardBotName: info.IDCardBotName,
          IsVisionEligible: String((info as any).IsVisionEligible),
          MEMBER_ID: String(info.member_ck),
          coverage_eligibility: info.coverage_eligibility,
          INQ_TYPE: info.INQ_TYPE,
          IsDentalEligible: String((info as any).IsDentalEligible),
          MEMBER_DOB: info.MEMBER_DOB,
          LOB: info.lob_group,
          lob_group: info.lob_group,
          IsMedicalEligibile: String((info as any).IsMedicalEligibile),
          Origin: info.Origin,
          Source: info.Source,
        },
        formInputs: [
          { id: 'SERV_Type', value: info.SERV_Type },
          { id: 'firstname', value: info.first_name },
          { id: 'lastname', value: info.last_name },
          { id: 'PLAN_ID', value: planId },
          { id: 'GROUP_ID', value: info.GROUP_ID },
          { id: 'MEMBER_ID', value: String(info.member_ck) },
          { id: 'LOB', value: info.lob_group },
          // ...add more as needed for all required fields...
        ],
        isLoading: false,
      });
    } catch (err) {
      console.error('Error loading chat configuration:', err);
      set({
        error:
          err instanceof Error
            ? err
            : new Error('Failed to load chat configuration'),
        isLoading: false,
        isEligible: false,
      });
    }
  },

  startChat: () => set({ isChatActive: true }),
  endChat: () => set({ isChatActive: false }),
}));

/**
 * Determines the inquiry type based on client ID, matching the logic in click_to_chat.js
 */
function _determineInquiryType(clientId: string): string {
  const ClientIdConst = {
    BlueCare: 'BC',
    BlueCarePlus: 'DS',
    CoverTN: 'CT',
    CoverKids: 'CK',
    SeniorCare: 'BA',
    Individual: 'INDV',
    BlueElite: 'INDVMX',
  };

  const ChatTypeConst = {
    BlueCareChat: 'BlueCare_Chat',
    SeniorCareChat: 'SCD_Chat',
    DefaultChat: 'MBAChat',
  };

  switch (clientId) {
    case ClientIdConst.BlueCare:
    case ClientIdConst.BlueCarePlus:
    case ClientIdConst.CoverTN:
    case ClientIdConst.CoverKids:
      return ChatTypeConst.BlueCareChat;
    case ClientIdConst.SeniorCare:
    case ClientIdConst.BlueElite:
      return ChatTypeConst.SeniorCareChat;
    case ClientIdConst.Individual:
    default:
      return ChatTypeConst.DefaultChat;
  }
}

/**
 * Determines the client ID based on plan details, matching the logic in click_to_chat.js
 */
function _getClientId(plan: unknown): string {
  const ClientIdConst = {
    BlueCare: 'BC',
    BlueCarePlus: 'DS',
    CoverTN: 'CT',
    CoverKids: 'CK',
    SeniorCare: 'BA',
    Individual: 'INDV',
    BlueElite: 'INDVMX',
  };

  // Type guard to safely access properties on the unknown plan object
  const typedPlan = plan as Record<string, any>;

  // Following the pattern in click_to_chat.js for client ID determination
  if (typedPlan && typedPlan.isBlueElite) {
    return ClientIdConst.BlueElite;
  }

  if (typedPlan && typedPlan.groupType === 'INDV') {
    return ClientIdConst.Individual;
  }

  // Default to memberClientID or 'Default' if not available
  return (typedPlan && typedPlan.memberClientID) || 'Default';
}
