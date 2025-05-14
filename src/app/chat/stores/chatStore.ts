// src/stores/chatStore.ts
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
} from '../genesysChatConfig';
import { ChatConfig } from '../schemas/genesys.schema';
import { ScriptLoadPhase } from '../types/ScriptLoadPhase';

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
  scriptLoadPhase: ScriptLoadPhase;

  // Centralized chat settings
  chatSettings: ChatSettings | null;

  // New script and settings actions
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
const _chatSelectors = {
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

export const useChatStore = create<ChatState>((set, _get) => ({
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
      logger.info('[ChatStore:CONFIG] loadChatConfiguration started', {
        memberId,
        planId,
        memberType,
        timestamp: new Date().toISOString(),
      });

      // Validate required parameters
      if (!memberId) {
        const error = new Error('Member ID is required for chat configuration');
        logger.error('[ChatStore:CONFIG] Missing memberId parameter', {
          error,
        });
        set({ isLoading: false, error });
        return;
      }

      if (!planId) {
        const error = new Error('Plan ID is required for chat configuration');
        logger.error('[ChatStore:CONFIG] Missing planId parameter', { error });
        set({ isLoading: false, error });
        return;
      }

      set({ isLoading: true, error: null });

      try {
        // 1. Load user/plan context (simulate or fetch as needed)
        logger.info('[ChatStore:CONFIG] Building user context', { memberId });
        const user = {
          userID: String(memberId),
          memberFirstname: '',
          memberLastName: '',
          formattedFirstName: '',
          subscriberID: '',
          sfx: '',
        };

        logger.info('[ChatStore:CONFIG] Building plan context', { planId });
        const plan = {
          memberMedicalPlanID: String(planId),
          groupId: '',
          memberClientID: '',
          groupType: '',
          memberDOB: '',
        };
        logger.info(
          '[ChatStore:CONFIG] User and plan context built successfully',
          {
            user,
            plan,
            timestamp: new Date().toISOString(),
          },
        );

        // 2. Fetch chat token
        logger.info('[ChatStore:CONFIG] Fetching chat token', {
          endpoint: '/api/chat/token',
          timestamp: new Date().toISOString(),
        });
        const tokenRes = await fetch('/api/chat/token');

        if (!tokenRes.ok) {
          const errorMsg = `Failed to fetch chat token: ${tokenRes.status} ${tokenRes.statusText}`;
          logger.error('[ChatStore:CONFIG] Token fetch failed', {
            status: tokenRes.status,
            statusText: tokenRes.statusText,
          });
          throw new Error(errorMsg);
        }

        const tokenData = await tokenRes.json();

        if (!tokenData || !tokenData.token) {
          logger.error(
            '[ChatStore:CONFIG] Token response missing token field',
            { tokenData },
          );
          throw new Error('Chat token response invalid - missing token field');
        }

        const token = tokenData.token;
        logger.info('[ChatStore:CONFIG] Chat token fetched successfully', {
          tokenFirstChars: token.substring(0, 5) + '...',
          tokenLength: token.length,
          timestamp: new Date().toISOString(),
        });

        // 3. Fetch chat info
        const apiUrl = `/api/chat/getChatInfo?memberId=${memberId}&memberType=${memberType}&planId=${planId}`;
        logger.info('[ChatStore:CONFIG] Fetching chat info', {
          apiUrl,
          timestamp: new Date().toISOString(),
        });

        const infoRes = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!infoRes.ok) {
          const errorMsg = `Failed to fetch chat info: ${infoRes.status} ${infoRes.statusText}`;
          logger.error('[ChatStore:CONFIG] Chat info fetch failed', {
            status: infoRes.status,
            statusText: infoRes.statusText,
          });
          throw new Error(errorMsg);
        }

        const info = await infoRes.json();

        if (!info) {
          logger.error(
            '[ChatStore:CONFIG] Chat info response invalid or empty',
          );
          throw new Error('Chat info response invalid or empty');
        }

        logger.info('[ChatStore:CONFIG] Chat info fetched successfully', {
          infoKeys: Object.keys(info),
          eligibility: info.isChatEligibleMember,
          cloudEligible: info.cloudChatEligible,
          timestamp: new Date().toISOString(),
        });

        // 4. Gather static config
        logger.info('[ChatStore:CONFIG] Gathering static configuration');
        const staticConfig = {
          coBrowseLicence: process.env.NEXT_PUBLIC_COBROWSE_LICENSE,
          cobrowseSource: process.env.NEXT_PUBLIC_COBROWSE_SOURCE,
          cobrowseURL: process.env.NEXT_PUBLIC_COBROWSE_URL,
          opsPhone: process.env.NEXT_PUBLIC_OPS_PHONE,
          opsPhoneHours: process.env.NEXT_PUBLIC_OPS_HOURS,
          chatHours: process.env.NEXT_PUBLIC_CHAT_HOURS,
          rawChatHrs: process.env.NEXT_PUBLIC_RAW_CHAT_HRS,
        };

        // Validate critical env variables
        if (!staticConfig.coBrowseLicence || !staticConfig.cobrowseURL) {
          logger.warn(
            '[ChatStore:CONFIG] Missing critical static config values',
            {
              hasCoBrowseLicence: !!staticConfig.coBrowseLicence,
              hasCobrowseURL: !!staticConfig.cobrowseURL,
            },
          );
        }

        logger.info('[ChatStore:CONFIG] Static config gathered successfully', {
          staticConfigKeys: Object.keys(staticConfig),
          timestamp: new Date().toISOString(),
        });

        // 5. Build GenesysChatConfig
        logger.info('[ChatStore:CONFIG] Building GenesysChatConfig');
        const genesysChatConfig = buildGenesysChatConfig({
          user,
          plan,
          apiConfig: { ...info, token },
          staticConfig,
        });

        if (!genesysChatConfig) {
          logger.error('[ChatStore:CONFIG] Failed to build GenesysChatConfig');
          throw new Error('Failed to build GenesysChatConfig');
        }

        // Validate critical fields in the generated config
        if (!genesysChatConfig.clickToChatToken) {
          logger.warn('[ChatStore:CONFIG] Missing clickToChatToken in config');
        }

        if (!genesysChatConfig.clickToChatEndpoint) {
          logger.warn(
            '[ChatStore:CONFIG] Missing clickToChatEndpoint in config',
          );
        }

        if (!genesysChatConfig.gmsChatUrl) {
          logger.warn('[ChatStore:CONFIG] Missing gmsChatUrl in config');
        }

        if (!genesysChatConfig.widgetUrl) {
          logger.warn('[ChatStore:CONFIG] Missing widgetUrl in config');
        }

        if (!genesysChatConfig.clickToChatJs) {
          logger.warn('[ChatStore:CONFIG] Missing clickToChatJs in config');
        }

        logger.info('[ChatStore:CONFIG] GenesysChatConfig built successfully', {
          configKeys: Object.keys(genesysChatConfig),
          chatMode: genesysChatConfig.chatMode,
          isCloud: genesysChatConfig.chatMode === 'cloud',
          hasToken: !!genesysChatConfig.clickToChatToken,
          hasEndpoint: !!genesysChatConfig.clickToChatEndpoint,
          timestamp: new Date().toISOString(),
        });

        set({
          genesysChatConfig,
          isLoading: false,
          error: null,
        });

        logger.info(
          '[ChatStore:CONFIG] Chat configuration loaded successfully',
          {
            timestamp: new Date().toISOString(),
          },
        );
      } catch (err: any) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        logger.error('[ChatStore:CONFIG] Error loading chat configuration', {
          error: errorObj.message,
          stack: errorObj.stack,
          timestamp: new Date().toISOString(),
        });
        set({ isLoading: false, error: errorObj });
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
