// src/stores/chatStore.ts
import { create } from 'zustand';
// import { ChatError } from '../types/index'; // Commented out due to missing file
import { logger } from '@/utils/logger'; // Add logger import
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';

// chatStore is the central Zustand store for chat state and actions.
// It manages UI state, chat session state, API responses, and all chat-related actions.
// All state changes, API calls, and errors are logged for traceability and debugging.

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

  // New fields
  token?: string;
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

      // Fetch the auth token and store it
      const res = await fetch('/api/chat/token');
      const data = await res.json();
      const token = data.token || '';
      set({ token });

      // Ensure we have a valid memberId string for the API call
      // Don't try to parse it to a number if it's already a string
      const memberIdString =
        typeof memberId === 'string' ? memberId : String(memberId);

      // Check if we have a valid memberId before making the API call
      if (
        !memberIdString ||
        memberIdString === 'undefined' ||
        memberIdString === 'null' ||
        memberIdString === 'NaN'
      ) {
        throw new Error('Invalid member ID');
      }

      // SERVER-SIDE CALL: Use fetch to backend API route
      const apiUrl = `/api/chat/getChatInfo?memberId=${memberIdString}&memberType=${memberType}&planId=${planId}`;
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

      logger.info('[ChatStore] API response received', {
        requestId,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('[ChatStore] API request failed', {
          requestId,
          status: response.status,
          statusText: response.statusText,
          errorText: errorText.substring(0, 500),
        });
        throw new Error(
          `Failed to load chat configuration: ${response.status} ${response.statusText}`,
        );
      }

      // Try to parse the JSON response
      let info;
      try {
        const responseText = await response.text();
        logger.info('[ChatStore] Raw API response', {
          requestId,
          responseText:
            responseText.substring(0, 200) +
            (responseText.length > 200 ? '...' : ''),
        });

        info = JSON.parse(responseText);
      } catch (parseError) {
        logger.error('[ChatStore] Failed to parse JSON response', {
          requestId,
          error:
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parsing error',
        });
        throw new Error('Invalid JSON response from chat configuration API');
      }

      // Log all available keys in the response
      logger.info('[ChatStore] Parsed chat configuration data structure', {
        requestId,
        availableKeys: Object.keys(info),
        hasBusinessHours: !!info.businessHours,
        businessHoursKeys: info.businessHours
          ? Object.keys(info.businessHours)
          : 'N/A',
        isEligible: info.isEligible,
        cloudChatEligible: info.cloudChatEligible,
        chatGroup: info.chatGroup,
      });

      // Transform the response data to match the format expected by the UI
      const adaptedInfo = {
        ...info,
        // If isEligible is not provided, assume true if chatGroup exists
        isEligible:
          info.isEligible !== undefined ? info.isEligible : !!info.chatGroup,
        // If businessHours is not provided, create it from workingHours
        businessHours: info.businessHours || {
          isOpen:
            info.workingHours === 'S_S_24' || info.workingHours?.includes('24'),
          text:
            info.workingHours === 'S_S_24'
              ? '24 hours, 7 days a week'
              : info.workingHours || '',
        },
        // Ensure these fields have default values if not present
        first_name: info.first_name || '',
        last_name: info.last_name || '',
        SERV_Type: info.SERV_Type || 'MemberChat',
        GROUP_ID: info.GROUP_ID || '',
        member_ck: info.member_ck || memberId,
        Origin: info.Origin || 'Member',
        Source: info.Source || 'Member Portal',
        lob_group: info.lob_group || 'Member',
      };

      logger.info('[ChatStore] Adapted chat configuration', {
        requestId,
        isEligible: adaptedInfo.isEligible,
        businessHoursOpen: adaptedInfo.businessHours.isOpen,
        businessHoursText: adaptedInfo.businessHours.text,
        chatGroup: adaptedInfo.chatGroup,
      });

      // Log critical values that determine chat rendering
      logger.info('[ChatStore] Critical chat configuration values', {
        requestId,
        isEligible: adaptedInfo.isEligible,
        cloudChatEligible: adaptedInfo.cloudChatEligible,
        businessHoursOpen: adaptedInfo.businessHours?.isOpen,
        businessHoursText: adaptedInfo.businessHours?.text,
        chatGroup: adaptedInfo.chatGroup,
        RoutingChatbotInteractionId: adaptedInfo.RoutingChatbotInteractionId,
      });

      set({
        eligibility: adaptedInfo,
        isEligible: adaptedInfo.isEligible,
        chatMode: adaptedInfo.cloudChatEligible ? 'cloud' : 'legacy',
        chatGroup: adaptedInfo.chatGroup,
        isOOO: !adaptedInfo.businessHours?.isOpen,
        businessHoursText: adaptedInfo.businessHours?.text || '',
        routingInteractionId: adaptedInfo.RoutingChatbotInteractionId,
        userData: {
          SERV_Type: adaptedInfo.SERV_Type,
          firstname: adaptedInfo.first_name,
          lastname: adaptedInfo.last_name,
          RoutingChatbotInteractionId: adaptedInfo.RoutingChatbotInteractionId,
          PLAN_ID: planId,
          GROUP_ID: adaptedInfo.GROUP_ID,
          IDCardBotName: adaptedInfo.IDCardBotName,
          IsVisionEligible: String((adaptedInfo as any).IsVisionEligible),
          MEMBER_ID: String(adaptedInfo.member_ck),
          coverage_eligibility: adaptedInfo.coverage_eligibility,
          INQ_TYPE: adaptedInfo.INQ_TYPE,
          IsDentalEligible: String((adaptedInfo as any).IsDentalEligible),
          MEMBER_DOB: adaptedInfo.MEMBER_DOB,
          LOB: adaptedInfo.lob_group,
          lob_group: adaptedInfo.lob_group,
          IsMedicalEligibile: String((adaptedInfo as any).IsMedicalEligibile),
          Origin: adaptedInfo.Origin,
          Source: adaptedInfo.Source,
        },
        formInputs: [
          { id: 'SERV_Type', value: adaptedInfo.SERV_Type },
          { id: 'firstname', value: adaptedInfo.first_name },
          { id: 'lastname', value: adaptedInfo.last_name },
          { id: 'PLAN_ID', value: planId },
          { id: 'GROUP_ID', value: adaptedInfo.GROUP_ID },
          { id: 'MEMBER_ID', value: String(adaptedInfo.member_ck) },
          { id: 'LOB', value: adaptedInfo.lob_group },
          // ...add more as needed for all required fields...
        ],
        isLoading: false,
      });

      logger.info('[ChatStore] Chat configuration loaded successfully', {
        requestId,
        chatMode: adaptedInfo.cloudChatEligible ? 'cloud' : 'legacy',
        stateUpdated: true,
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

  // New fields
  token: undefined,
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
