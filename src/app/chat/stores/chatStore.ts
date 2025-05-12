// src/stores/chatStore.ts
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { ChatSettings, ScriptLoadPhase } from '../types/index';
import { createChatSettings } from '../utils/chatUtils';

// chatStore is the central Zustand store for chat state and actions.
// It manages UI state, chat session state, API responses, and all chat-related actions.
// All state changes, API calls, and errors are logged for traceability and debugging.

// This helps create stable function references
function makeStable<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

// Define core chat data structure
interface ChatData {
  isEligible: boolean;
  cloudChatEligible: boolean;
  chatGroup?: string;
  businessHours?: {
    isOpen: boolean;
    text: string;
  };
  routingInteractionId?: string;
  userData: Record<string, string>;
  formInputs: { id: string; value: string }[];
}

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

  // Core data
  chatData: ChatData | null;
  config?: ChatConfig;
  token?: string;
  isPlanSwitcherLocked: boolean;
  planSwitcherTooltip: string;

  // Script loading state
  // @ts-ignore - Using ScriptLoadPhase from types/index.ts
  scriptLoadPhase: ScriptLoadPhase;

  // Centralized chat settings
  chatSettings: ChatSettings | null;

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
  setPlanSwitcherLocked: (locked: boolean) => void;
  updateConfig: (cfg: Partial<ChatConfig>) => void;
  closeAndRedirect: () => void;
  loadChatConfiguration: (
    memberId: number | string,
    planId: string,
    memberType?: string,
  ) => Promise<void>;
  startChat: () => void;
  endChat: () => void;

  // New script and settings actions
  // @ts-ignore - Using ScriptLoadPhase from types/index.ts
  setScriptLoadPhase: (phase: ScriptLoadPhase) => void;
  updateChatSettings: (settings: Partial<ChatSettings>) => void;
  initializeChatSettings: (
    userData: Record<string, any>,
    mode: 'legacy' | 'cloud',
  ) => void;
}

// Selectors for derived state - these don't cause re-renders when other state changes
const chatSelectors = {
  isEligible: (state: ChatState) => state.chatData?.isEligible || false,
  chatMode: (state: ChatState) =>
    state.chatData?.cloudChatEligible ? 'cloud' : 'legacy',
  isOOO: (state: ChatState) =>
    !(state.chatData?.businessHours?.isOpen || false),
  chatGroup: (state: ChatState) => state.chatData?.chatGroup,
  businessHoursText: (state: ChatState) =>
    state.chatData?.businessHours?.text || '',
  routingInteractionId: (state: ChatState) =>
    state.chatData?.routingInteractionId,
  userData: (state: ChatState) => state.chatData?.userData || {},
  formInputs: (state: ChatState) => state.chatData?.formInputs || [],
  eligibility: (state: ChatState) => state.chatData,
};

export const useChatStore = create<ChatState>((set, get) => ({
  // UI state
  isOpen: false,
  isMinimized: false,
  newMessageCount: 0,

  // Chat state
  isChatActive: false,
  isLoading: true,
  error: null,
  messages: [],

  // Core data
  chatData: null,
  config: undefined,
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',

  // Script loading state
  // @ts-ignore - Using ScriptLoadPhase from types/index.ts
  scriptLoadPhase: ScriptLoadPhase.INIT,

  // Centralized chat settings
  chatSettings: null,

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

  loadChatConfiguration: makeStable(
    async (memberId, planId, memberType = 'byMemberCk') => {
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

        // Transform the API response to our ChatData structure
        const formInputs = [
          { id: 'SERV_Type', value: info.SERV_Type || 'MemberChat' },
          { id: 'firstname', value: info.first_name || '' },
          { id: 'lastname', value: info.last_name || '' },
          { id: 'PLAN_ID', value: planId },
          { id: 'GROUP_ID', value: info.GROUP_ID || '' },
          { id: 'MEMBER_ID', value: String(info.member_ck || memberId) },
          { id: 'LOB', value: info.lob_group || 'Member' },
        ];

        const userData = {
          SERV_Type: info.SERV_Type || 'MemberChat',
          firstname: info.first_name || '',
          lastname: info.last_name || '',
          RoutingChatbotInteractionId: info.RoutingChatbotInteractionId,
          PLAN_ID: planId,
          GROUP_ID: info.GROUP_ID || '',
          IDCardBotName: info.IDCardBotName,
          IsVisionEligible: String((info as any).IsVisionEligible),
          MEMBER_ID: String(info.member_ck || memberId),
          coverage_eligibility: info.coverage_eligibility,
          INQ_TYPE: info.INQ_TYPE,
          IsDentalEligible: String((info as any).IsDentalEligible),
          MEMBER_DOB: info.MEMBER_DOB,
          LOB: info.lob_group || 'Member',
          lob_group: info.lob_group || 'Member',
          IsMedicalEligibile: String((info as any).IsMedicalEligibile),
          Origin: info.Origin || 'Member',
          Source: info.Source || 'Member Portal',
          opsPhone:
            info.opsPhone ||
            info.ops_phone ||
            process.env.NEXT_PUBLIC_OPS_PHONE ||
            '',
          opsPhoneHours:
            info.opsPhoneHours ||
            info.ops_phone_hours ||
            info.businessHours?.text ||
            '' ||
            process.env.NEXT_PUBLIC_OPS_HOURS ||
            '',
        };

        const chatData: ChatData = {
          isEligible: info.isEligible ?? !!info.chatGroup,
          cloudChatEligible: info.cloudChatEligible || false,
          chatGroup: info.chatGroup,
          businessHours: info.businessHours || {
            isOpen:
              info.workingHours === 'S_S_24' ||
              info.workingHours?.includes('24'),
            text:
              info.workingHours === 'S_S_24'
                ? '24 hours, 7 days a week'
                : info.workingHours || '',
          },
          routingInteractionId: info.RoutingChatbotInteractionId,
          userData,
          formInputs,
        };

        logger.info('[ChatStore] Created chat data structure', {
          requestId,
          isEligible: chatData.isEligible,
          chatMode: chatData.cloudChatEligible ? 'cloud' : 'legacy',
        });

        set({
          chatData,
          isLoading: false,
        });

        logger.info('[ChatStore] Chat configuration loaded successfully', {
          requestId,
          chatMode: chatData.cloudChatEligible ? 'cloud' : 'legacy',
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
        });
      }
    },
  ),

  startChat: () => {
    logger.info('[ChatStore] Starting chat');
    set({ isChatActive: true });
  },
  endChat: () => {
    logger.info('[ChatStore] Ending chat');
    set({ isChatActive: false });
  },

  // New script and settings actions
  // @ts-ignore - Using ScriptLoadPhase from types/index.ts
  setScriptLoadPhase: (phase) => {
    logger.info('[ChatStore] Setting script load phase', { phase });
    set({ scriptLoadPhase: phase });
  },

  updateChatSettings: (settings) => {
    logger.info('[ChatStore] Updating chat settings', {
      settingsKeys: Object.keys(settings),
    });
    set((state) => ({
      chatSettings: state.chatSettings
        ? { ...state.chatSettings, ...settings }
        : (settings as ChatSettings),
    }));

    // Update window.chatSettings for backward compatibility
    if (typeof window !== 'undefined' && window.chatSettings) {
      window.chatSettings = {
        ...window.chatSettings,
        ...settings,
      };
    }
  },

  initializeChatSettings: (userData, mode) => {
    logger.info('[ChatStore] Initializing chat settings', {
      mode,
      userDataKeys: Object.keys(userData),
    });

    // @ts-ignore - Using createChatSettings from utils/chatUtils.ts
    const settings = createChatSettings(userData, mode);
    set({ chatSettings: settings });

    // Set window.chatSettings for backward compatibility
    if (typeof window !== 'undefined') {
      window.chatSettings = settings;
    }

    return settings;
  },

  // Token field
  token: undefined,
}));

/**
 * DEPRECATED: The object properties below are maintained for backward compatibility
 * but should not be used in new code. Use chatSelectors instead.
 *
 * @example
 * // Old approach (deprecated):
 * const isEligible = useChatStore.isEligible;
 *
 * // New approach (preferred):
 * import { chatSelectors } from '@/app/chat/stores/chatStore';
 * const isEligible = chatSelectors.isEligible(useChatStore.getState());
 *
 * // Or within a component:
 * const isEligible = chatSelectors.isEligible(useChatStore());
 */
// For backward compatibility, re-export the selectors as properties of useChatStore
Object.defineProperties(useChatStore, {
  // Deprecated: Add accessor for each selector to maintain backward compatibility
  isEligible: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.isEligible is deprecated. Use chatSelectors.isEligible instead.',
      );
      return chatSelectors.isEligible(useChatStore.getState());
    },
  },
  chatMode: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.chatMode is deprecated. Use chatSelectors.chatMode instead.',
      );
      return chatSelectors.chatMode(useChatStore.getState());
    },
  },
  isOOO: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.isOOO is deprecated. Use chatSelectors.isOOO instead.',
      );
      return chatSelectors.isOOO(useChatStore.getState());
    },
  },
  chatGroup: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.chatGroup is deprecated. Use chatSelectors.chatGroup instead.',
      );
      return chatSelectors.chatGroup(useChatStore.getState());
    },
  },
  businessHoursText: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.businessHoursText is deprecated. Use chatSelectors.businessHoursText instead.',
      );
      return chatSelectors.businessHoursText(useChatStore.getState());
    },
  },
  routingInteractionId: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.routingInteractionId is deprecated. Use chatSelectors.routingInteractionId instead.',
      );
      return chatSelectors.routingInteractionId(useChatStore.getState());
    },
  },
  userData: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.userData is deprecated. Use chatSelectors.userData instead.',
      );
      return chatSelectors.userData(useChatStore.getState());
    },
  },
  formInputs: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.formInputs is deprecated. Use chatSelectors.formInputs instead.',
      );
      return chatSelectors.formInputs(useChatStore.getState());
    },
  },
  eligibility: {
    get: () => {
      console.warn(
        '[ChatStore] useChatStore.eligibility is deprecated. Use chatSelectors.eligibility instead.',
      );
      return chatSelectors.eligibility(useChatStore.getState());
    },
  },
});

// Export the selectors for components that need derived state
export { chatSelectors };
