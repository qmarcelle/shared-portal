// src/stores/chatStore.ts
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
} from '../genesysChatConfig';
import { ChatConfig } from '../schemas/genesys.schema';

// chatStore is the central Zustand store for chat state and actions.
// It manages UI state, chat session state, API responses, and all chat-related actions.
// All state changes, API calls, and errors are logged for traceability and debugging.

// This helps create stable function references
function makeStable<T extends (...args: unknown[]) => unknown>(fn: T): T {
  return fn;
}

// Define core chat data structure
interface ChatData {
  isEligible: boolean;
  cloudChatEligible: boolean;
  chatAvailable?: boolean;
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
  // @ts-expect-error - Using ScriptLoadPhase from types/index.ts
  scriptLoadPhase: ScriptLoadPhase;

  // Centralized chat settings
  chatSettings: ChatSettings | null;

  // New script and settings actions
  // @ts-expect-error - Using ScriptLoadPhase from types/index.ts
  setScriptLoadPhase: (phase: ScriptLoadPhase) => void;

  // New GenesysChatConfig
  genesysChatConfig?: GenesysChatConfig;

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
  closeAndRedirect: () => void;
  loadChatConfiguration: (
    memberId: number | string,
    planId: string,
    memberType?: string,
  ) => Promise<void>;
  startChat: () => void;
  endChat: () => void;
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
  // @ts-expect-error - Using ScriptLoadPhase from types/index.ts
  scriptLoadPhase: ScriptLoadPhase.INIT,

  // Centralized chat settings
  chatSettings: null,

  // New GenesysChatConfig
  genesysChatConfig: undefined,

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
      set({ isLoading: true, error: null });
      try {
        // 1. Load user/plan context (simulate or fetch as needed)
        // For this refactor, assume memberId/planId are sufficient for chat info API
        const user = {
          userID: String(memberId),
          memberFirstname: '',
          memberLastName: '',
          formattedFirstName: '',
          subscriberID: '',
          sfx: '',
        };
        const plan = {
          memberMedicalPlanID: String(planId),
          groupId: '',
          memberClientID: '',
          groupType: '',
          memberDOB: '',
        };
        // 2. Fetch chat token
        const tokenRes = await fetch('/api/chat/token');
        if (!tokenRes.ok) throw new Error('Failed to fetch chat token');
        const tokenData = await tokenRes.json();
        const token = tokenData.token || '';
        // 3. Fetch chat info
        const apiUrl = `/api/chat/getChatInfo?memberId=${memberId}&memberType=${memberType}&planId=${planId}`;
        const infoRes = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!infoRes.ok) throw new Error('Failed to fetch chat info');
        const info = await infoRes.json();
        // 4. Gather static config
        const staticConfig = {
          coBrowseLicence: process.env.NEXT_PUBLIC_COBROWSE_LICENSE,
          cobrowseSource: process.env.NEXT_PUBLIC_COBROWSE_SOURCE,
          cobrowseURL: process.env.NEXT_PUBLIC_COBROWSE_URL,
          opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE,
          opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS,
          chatHours: process.env.NEXT_PUBLIC_CHAT_HOURS,
          rawChatHrs: process.env.NEXT_PUBLIC_RAW_CHAT_HRS,
          selfServiceLinks: info.selfServiceLinks || [],
          idCardChatBotName:
            info.IDCardBotName || process.env.NEXT_PUBLIC_IDCARD_BOT_NAME,
          widgetUrl: process.env.NEXT_PUBLIC_WIDGETS_MIN_URL,
          clickToChatJs: process.env.NEXT_PUBLIC_CLICK_TO_CHAT_JS_URL,
          chatTokenEndpoint: '/api/chat/token',
          coBrowseEndpoint: process.env.NEXT_PUBLIC_COBROWSE_ENDPOINT,
        };
        // 5. Build GenesysChatConfig
        const apiConfig = {
          clickToChatToken: token,
          clickToChatEndpoint: info.clickToChatEndpoint || '',
          clickToChatDemoEndPoint: info.clickToChatDemoEndPoint,
          routingchatbotEligible: info.routingchatbotEligible,
          isChatEligibleMember: info.isEligible,
          isDemoMember: info.isDemoMember,
          isAmplifyMem: info.isAmplifyMem,
          isCobrowseActive: info.isCobrowseActive,
          isMagellanVAMember: info.isMagellanVAMember,
          isDental: info.IsDentalEligible,
          isMedical: info.IsMedicalEligibile,
          isVision: info.IsVisionEligible,
          isWellnessOnly: info.isWellnessOnly,
          isCobraEligible: info.isCobraEligible,
          isIDCardEligible: info.isIDCardEligible,
          isChatAvailable: info.chatAvailable,
          chatbotEligible: info.chatbotEligible,
          isMedicalAdvantageGroup: info.isMedicalAdvantageGroup,
        };
        // Fill in any additional user/plan fields from info if needed
        user.memberFirstname = info.first_name || '';
        user.memberLastName = info.last_name || '';
        user.formattedFirstName = info.first_name || '';
        user.subscriberID = info.subscriberID || '';
        user.sfx = info.sfx || '';
        plan.groupId = info.GROUP_ID || '';
        plan.memberClientID = info.clientID || '';
        plan.groupType = info.policyType || '';
        plan.memberDOB = info.MEMBER_DOB || '';
        // 6. Build and store config
        const genesysChatConfig = buildGenesysChatConfig({
          user,
          plan,
          apiConfig,
          staticConfig,
        });
        set({ genesysChatConfig, isLoading: false });
        if (typeof window !== 'undefined') {
          window.chatSettings = genesysChatConfig;
        }
      } catch (err) {
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
  setScriptLoadPhase: (phase) => {
    logger.info('[ChatStore] Setting script load phase', { phase });
    set({ scriptLoadPhase: phase });
  },

  // Token field
  token: undefined,
}));
