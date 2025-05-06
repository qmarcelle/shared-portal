// src/stores/chatStore.ts
import { create } from 'zustand';
// import { ChatError } from '../types/index'; // Commented out due to missing file
import { logger } from '@/utils/logger'; // Add logger import
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
  eligibility: any | null;

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
  setEligibility: (info: any | null) => void;
  setPlanSwitcherLocked: (locked: boolean) => void;
  updateConfig: (cfg: Partial<ChatConfig>) => void;
  closeAndRedirect: () => void;

  // New actions
  loadChatConfiguration: (
    memberId: number,
    planId: string,
    memberType?: string,
  ) => Promise<void>;
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
  setOpen: (isOpen) => {
    logger.info('[ChatStore] Set chat open state', { isOpen });
    set({ isOpen });
  },
  setMinimized: (min) => {
    logger.info('[ChatStore] Set chat minimized state', { minimized: min });
    set({ isMinimized: min });
  },
  minimizeChat: () => {
    logger.info('[ChatStore] Minimizing chat');
    set({ isMinimized: true });
  },
  maximizeChat: () => {
    logger.info('[ChatStore] Maximizing chat');
    set({ isMinimized: false });
  },
  setError: (error) => {
    if (error) {
      logger.error('[ChatStore] Chat error', {
        error: error.message,
        stack: error.stack,
      });
    } else {
      logger.info('[ChatStore] Clearing chat error');
    }
    set({ error });
  },
  addMessage: (message) => {
    logger.info('[ChatStore] Adding message', {
      sender: message.sender,
      contentLength: message.content?.length || 0,
    });
    set((s) => ({
      messages: [...s.messages, { id: Date.now().toString(), ...message }],
    }));
  },
  clearMessages: () => {
    logger.info('[ChatStore] Clearing all messages');
    set({ messages: [] });
  },
  setChatActive: (active) => {
    logger.info('[ChatStore] Setting chat active state', { active });
    set({ isChatActive: active });
  },
  setLoading: (loading) => {
    logger.info('[ChatStore] Setting loading state', { loading });
    set({ isLoading: loading });
  },
  incrementMessageCount: () => {
    logger.info('[ChatStore] Incrementing message count');
    set((s) => ({ newMessageCount: s.newMessageCount + 1 }));
  },
  resetMessageCount: () => {
    logger.info('[ChatStore] Resetting message count to zero');
    set({ newMessageCount: 0 });
  },
  setEligibility: (eligibility) => {
    logger.info('[ChatStore] Setting eligibility data', {
      isEligible: eligibility?.isEligible,
      cloudChatEligible: eligibility?.cloudChatEligible,
    });
    set({ eligibility });
  },

  setPlanSwitcherLocked: (locked) => {
    logger.info('[ChatStore] Setting plan switcher lock state', { locked });
    set({
      isPlanSwitcherLocked: locked,
      planSwitcherTooltip: locked
        ? 'You cannot switch plans during an active chat session.'
        : '',
    });
  },

  updateConfig: (cfg) => {
    logger.info('[ChatStore] Updating chat configuration', {
      configFields: Object.keys(cfg),
    });
    try {
      const validated = ChatConfigSchema.parse(cfg);
      logger.info('[ChatStore] Chat configuration validated successfully');
      set({ config: validated });
    } catch (err) {
      logger.error('[ChatStore] Invalid chat configuration', {
        error: err instanceof Error ? err.message : 'Validation error',
        invalidFields: Object.keys(cfg),
      });
      console.error('Invalid chat configuration:', err);
      set({
        error: new Error('Invalid chat configuration'),
      });
    }
  },

  closeAndRedirect: () => {
    logger.info('[ChatStore] Closing chat and redirecting');
    set({
      isOpen: false,
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
    });
  },

  // New actions
  loadChatConfiguration: async (
    memberId,
    planId,
    memberType = 'byMemberCk',
  ) => {
    const requestId = Date.now().toString();
    logger.info('[ChatStore] Loading chat configuration', {
      requestId,
      memberId,
      planId,
      memberType,
    });

    try {
      set({ isLoading: true, error: null });

      // SERVER-SIDE CALL: Use fetch to backend API route
      const apiUrl = `/api/chat/getChatInfo?memberId=${memberId}&memberType=${memberType}&planId=${planId}`;
      logger.info('[ChatStore] Sending API request for chat configuration', {
        requestId,
        url: apiUrl,
      });

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': requestId,
        },
      });

      if (!response.ok) {
        logger.error('[ChatStore] API request failed', {
          requestId,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to load chat configuration');
      }

      logger.info('[ChatStore] API response received', {
        requestId,
        status: response.status,
      });

      const info = await response.json();
      logger.info('[ChatStore] Parsed chat configuration data', {
        requestId,
        isEligible: info.isEligible,
        cloudChatEligible: info.cloudChatEligible,
        chatGroup: info.chatGroup,
        businessHoursOpen: !!info.businessHours?.isOpen,
      });

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

      logger.info('[ChatStore] Chat configuration loaded successfully', {
        requestId,
        chatMode: info.cloudChatEligible ? 'cloud' : 'legacy',
      });
    } catch (err) {
      logger.error('[ChatStore] Error loading chat configuration', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        memberId,
        planId,
        memberType,
      });

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

  startChat: () => {
    logger.info('[ChatStore] Starting chat');
    set({ isChatActive: true });
  },
  endChat: () => {
    logger.info('[ChatStore] Ending chat');
    set({ isChatActive: false });
  },
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
