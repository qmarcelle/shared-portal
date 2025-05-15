// src/stores/chatStore.ts
/**
 * @file chatStore.ts
 * @description Centralized Zustand store for managing all Genesys chat-related state and actions.
 * As per README.md: "All chat config and state is managed in a Zustand store (`chatStore.ts`)
 * organized by domains (UI, config, session, scripts)."
 *
 * Responsibilities:
 * - Manages UI state (isOpen, isMinimized, newMessageCount).
 * - Handles chat configuration (isLoading, error, genesysChatConfig, PBE consent, API validation).
 *   - Fetches data from `/api/chat/getChatInfo`.
 *   - Validates API response using Zod schema (`schemas/genesys.schema.ts`).
 *   - Builds final `genesysChatConfig` using `buildGenesysChatConfig`.
 * - Manages chat session state (isChatActive, messages).
 * - Tracks script loading phases (scriptLoadPhase).
 * - Provides actions to modify state and interact with the chat system.
 * - Exposes selectors for optimized state access in components.
 *
 * Logging: All significant state changes, API calls, and errors are logged for traceability and debugging.
 */
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import { buildGenesysChatConfig } from '../genesysChatConfig';
import { ChatConfig, createGenesysConfig } from '../schemas/genesys.schema';
import { GenesysChatConfig, ScriptLoadPhase } from '../types/chat-types';

const LOG_STORE_PREFIX = '[ChatStore]'; // General store lifecycle/setup logs
const LOG_UI_PREFIX = '[ChatStore:UI]';
const LOG_CONFIG_PREFIX = '[ChatStore:Config]';
const LOG_SESSION_PREFIX = '[ChatStore:Session]';
const LOG_SCRIPT_PREFIX = '[ChatStore:Script]';

// chatStore is the central Zustand store for chat state and actions.
// It manages UI state, chat session state, API responses, and all chat-related actions.
// All state changes, API calls, and errors are logged for traceability and debugging.

// This helps create stable function references
function makeStable<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

// Add documentation for Chat State Management at the top of the file where state is defined
/**
 * Chat State Management:
 * - ui.isOpen: Controls visual state of chat window (open/closed)
 * - session.isChatActive: Indicates an ongoing conversation exists
 *
 * Behavior:
 * - When user manually closes UI: Window closes but session remains active
 * - When Genesys triggers chat closure: Both UI closes and session ends
 * - When user reopens UI: They can continue existing session if active
 * - When redirecting: Session is considered ended (see closeAndRedirect)
 */

// Update the ChatState interface to include chatConfig documentation
/**
 * Stores the Zod-validated raw API response (from /api/chat/getChatInfo)
 * for potential future use, stricter type checking, or debugging.
 */
interface ChatState {
  // UI state domain
  ui: {
    isOpen: boolean;
    isMinimized: boolean;
    newMessageCount: number;
  };

  // Config state domain
  config: {
    isLoading: boolean;
    error: Error | null;
    genesysChatConfig?: GenesysChatConfig;
    chatData: ChatData | null;
    chatConfig?: ChatConfig;
    hasConsent: boolean;
    token?: string;
  };

  // Session state domain
  session: {
    isChatActive: boolean;
    messages: Array<{ id: string; content: string; sender: 'user' | 'agent' }>;
    isPlanSwitcherLocked: boolean;
    planSwitcherTooltip: string;
  };

  // Script state domain
  scripts: {
    scriptLoadPhase: ScriptLoadPhase;
  };

  // Actions - grouped by responsibility
  actions: {
    // UI actions
    setOpen: (isOpen: boolean) => void;
    setMinimized: (min: boolean) => void;
    minimizeChat: () => void;
    maximizeChat: () => void;
    incrementMessageCount: () => void;
    resetMessageCount: () => void;

    // Config actions
    setError: (err: Error | null) => void;
    loadChatConfiguration: (
      memberId: number | string,
      planId: string,
      memberType?: string,
      userContext?: any,
      planContext?: any,
    ) => Promise<void>;

    // Session actions
    setChatActive: (active: boolean) => void;
    setLoading: (loading: boolean) => void;
    addMessage: (m: { content: string; sender: 'user' | 'agent' }) => void;
    clearMessages: () => void;
    setPlanSwitcherLocked: (locked: boolean) => void;
    closeAndRedirect: () => void;
    startChat: () => void;
    endChat: () => void;

    // Script actions
    setScriptLoadPhase: (phase: ScriptLoadPhase) => void;
  };
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

// Selectors for derived state - these don't cause re-renders when other state changes
export const chatUISelectors = {
  isOpen: (state: ChatState) => state.ui.isOpen,
  isMinimized: (state: ChatState) => state.ui.isMinimized,
  newMessageCount: (state: ChatState) => state.ui.newMessageCount,
};

export const chatConfigSelectors = {
  isLoading: (state: ChatState) => state.config.isLoading,
  error: (state: ChatState) => state.config.error,
  genesysChatConfig: (state: ChatState) => state.config.genesysChatConfig,
  isEligible: (state: ChatState) => state.config.chatData?.isEligible || false,
  hasConsent: (state: ChatState) => state.config.hasConsent,
  chatMode: (state: ChatState) =>
    state.config.chatData?.cloudChatEligible ? 'cloud' : 'legacy',
  isOOO: (state: ChatState) =>
    !(state.config.chatData?.businessHours?.isOpen ?? false),
  chatGroup: (state: ChatState) => state.config.chatData?.chatGroup,
  businessHoursText: (state: ChatState) =>
    state.config.chatData?.businessHours?.text || '',
  routingInteractionId: (state: ChatState) =>
    state.config.chatData?.routingInteractionId,
  userData: (state: ChatState) => state.config.chatData?.userData || {},
  formInputs: (state: ChatState) => state.config.chatData?.formInputs || [],
  isChatEnabled: (state: ChatState) =>
    (state.config.chatData?.isEligible || false) &&
    state.config.chatData?.chatAvailable !== false &&
    state.config.hasConsent,
};

export const chatSessionSelectors = {
  isChatActive: (state: ChatState) => state.session.isChatActive,
  messages: (state: ChatState) => state.session.messages,
  isPlanSwitcherLocked: (state: ChatState) =>
    state.session.isPlanSwitcherLocked,
  planSwitcherTooltip: (state: ChatState) => state.session.planSwitcherTooltip,
};

export const chatScriptSelectors = {
  scriptLoadPhase: (state: ChatState) => state.scripts.scriptLoadPhase,
};

export const useChatStore = create<ChatState>((set, get) => {
  logger.info(`${LOG_STORE_PREFIX} Initializing chat store...`);

  return {
    // UI state
    ui: {
      isOpen: false,
      isMinimized: false,
      newMessageCount: 0,
    },

    // Config state
    config: {
      isLoading: true,
      error: null,
      genesysChatConfig: undefined,
      chatData: null,
      chatConfig: undefined,
      hasConsent: true, // Default to true until PBE data is loaded
      token: undefined,
    },

    // Session state
    session: {
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
      planSwitcherTooltip: '',
    },

    // Script state
    scripts: {
      scriptLoadPhase: ScriptLoadPhase.INIT,
    },

    // Actions implementation
    actions: {
      // UI actions
      setOpen: (isOpen) => {
        logger.info(`${LOG_UI_PREFIX} setOpen called`, { isOpen });
        set((state) => ({
          ui: {
            ...state.ui,
            isOpen,
          },
        }));
      },

      setMinimized: (min) => {
        logger.info(`${LOG_UI_PREFIX} setMinimized called`, { min });
        set((state) => ({
          ui: {
            ...state.ui,
            isMinimized: min,
          },
        }));
      },

      minimizeChat: () => {
        logger.info(`${LOG_UI_PREFIX} minimizeChat called`);
        set((state) => ({
          ui: {
            ...state.ui,
            isMinimized: true,
          },
        }));
      },

      maximizeChat: () => {
        logger.info(`${LOG_UI_PREFIX} maximizeChat called`);
        set((state) => ({
          ui: {
            ...state.ui,
            isMinimized: false,
          },
        }));
      },

      incrementMessageCount: () => {
        logger.info(`${LOG_UI_PREFIX} incrementMessageCount called`);
        set((state) => ({
          ui: {
            ...state.ui,
            newMessageCount: state.ui.newMessageCount + 1,
          },
        }));
      },

      resetMessageCount: () => {
        logger.info(`${LOG_UI_PREFIX} resetMessageCount called`);
        set((state) => ({
          ui: {
            ...state.ui,
            newMessageCount: 0,
          },
        }));
      },

      // Config actions
      setError: (error) => {
        logger.info(`${LOG_CONFIG_PREFIX} setError called`, {
          error: error?.message,
        });
        if (error) {
          logger.error('[ChatStore:CONFIG] Chat error', {
            error: error.message,
            stack: error.stack,
          });
        } else {
          logger.info('[ChatStore:CONFIG] Clearing chat error');
        }
        set((state) => ({
          config: {
            ...state.config,
            error,
          },
        }));
      },

      // Session actions
      setChatActive: (active) => {
        logger.info(`${LOG_SESSION_PREFIX} setChatActive called`, { active });
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: active,
          },
        }));
      },

      setLoading: (loading) => {
        logger.info(
          `${LOG_CONFIG_PREFIX} setLoading called (likely general loading state, not chat config specific)`,
          { loading },
        );
        set((state) => ({
          config: {
            ...state.config,
            isLoading: loading,
          },
        }));
      },

      addMessage: (message) => {
        logger.info(`${LOG_SESSION_PREFIX} addMessage called`, {
          sender: message.sender,
        });
        logger.info(`${LOG_SESSION_PREFIX} Adding message`, {
          sender: message.sender,
          contentLength: message.content?.length || 0,
        });
        set((state) => ({
          session: {
            ...state.session,
            messages: [
              ...state.session.messages,
              { id: Date.now().toString(), ...message },
            ],
          },
        }));
      },

      clearMessages: () => {
        logger.info(`${LOG_SESSION_PREFIX} clearMessages called`);
        logger.info(`${LOG_SESSION_PREFIX} Clearing all messages`);
        set((state) => ({
          session: {
            ...state.session,
            messages: [],
          },
        }));
      },

      setPlanSwitcherLocked: (locked) => {
        logger.info(`${LOG_SESSION_PREFIX} setPlanSwitcherLocked called`, {
          locked,
        });
        logger.info(`${LOG_SESSION_PREFIX} Setting plan switcher lock state`, {
          locked,
        });
        set((state) => ({
          session: {
            ...state.session,
            isPlanSwitcherLocked: locked,
            planSwitcherTooltip: locked
              ? 'You cannot switch plans during an active chat session.'
              : '',
          },
        }));
      },

      closeAndRedirect: () => {
        logger.info(
          `${LOG_SESSION_PREFIX} closeAndRedirect called. Setting chat inactive and clearing messages.`,
        );
        logger.info(`${LOG_SESSION_PREFIX} Closing chat and redirecting`);
        set((state) => ({
          ui: {
            ...state.ui,
            isOpen: false,
          },
          session: {
            ...state.session,
            isChatActive: false,
            messages: [],
            isPlanSwitcherLocked: false,
          },
        }));
      },

      startChat: () => {
        logger.info(
          `${LOG_SESSION_PREFIX} startChat called. Setting chat active and open.`,
        );
        logger.info(`${LOG_SESSION_PREFIX} Starting chat`);
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: true,
            isPlanSwitcherLocked: true,
          },
        }));
      },

      endChat: () => {
        logger.info(
          `${LOG_SESSION_PREFIX} endChat called. Setting chat inactive and UI closed.`,
        );
        logger.info(`${LOG_SESSION_PREFIX} Ending chat`);
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: false,
            isPlanSwitcherLocked: false,
          },
        }));
      },

      // Script actions
      setScriptLoadPhase: (phase) => {
        logger.info(`${LOG_SCRIPT_PREFIX} setScriptLoadPhase called`, {
          phase,
        });
        logger.info(`${LOG_SCRIPT_PREFIX} Setting script load phase`, {
          phase,
        });
        set((state) => ({
          scripts: {
            ...state.scripts,
            scriptLoadPhase: phase,
          },
        }));
      },

      // Enhanced loadChatConfiguration with PBE integration
      loadChatConfiguration: makeStable(
        async (
          memberId: number | string,
          planId: string,
          memberType = 'byMemberCk',
          userContext?: {
            firstName?: string;
            lastName?: string;
            subscriberId?: string;
            suffix?: string;
          },
          planContext?: {
            groupId?: string;
            clientId?: string;
            groupType?: string;
          },
        ) => {
          logger.info(`${LOG_CONFIG_PREFIX} loadChatConfiguration started`, {
            memberId,
            planId,
            memberType,
          });
          set((state) => ({
            config: { ...state.config, isLoading: true, error: null },
          }));

          try {
            // 1. Load user/plan context (from params or build defaults)
            logger.info(`${LOG_CONFIG_PREFIX} Building user context`, {
              memberId,
            });
            const user = {
              userID: String(memberId),
              memberFirstname: userContext?.firstName || '',
              memberLastName: userContext?.lastName || '',
              formattedFirstName: userContext?.firstName || '',
              subscriberID: userContext?.subscriberId || '',
              sfx: userContext?.suffix || '',
            };

            logger.info(`${LOG_CONFIG_PREFIX} Building plan context`, {
              planId,
            });
            const plan = {
              memberMedicalPlanID: String(planId),
              groupId: planContext?.groupId || '',
              memberClientID: planContext?.clientId || '',
              groupType: planContext?.groupType || '',
              memberDOB: '',
            };

            logger.info(
              `${LOG_CONFIG_PREFIX} User and plan context built successfully`,
              {
                user,
                plan,
                timestamp: new Date().toISOString(),
              },
            );

            // 2. Fetch chat token
            logger.info(`${LOG_CONFIG_PREFIX} Fetching chat token`, {
              endpoint: '/api/chat/token',
              timestamp: new Date().toISOString(),
            });
            const tokenRes = await fetch('/api/chat/token');

            if (!tokenRes.ok) {
              const errorMsg = `Failed to fetch chat token: ${tokenRes.status} ${tokenRes.statusText}`;
              logger.error(`${LOG_CONFIG_PREFIX} Token fetch failed`, {
                status: tokenRes.status,
                statusText: tokenRes.statusText,
              });
              throw new Error(errorMsg);
            }

            const tokenData = await tokenRes.json();

            if (!tokenData || !tokenData.token) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Token response missing token field`,
                { tokenData },
              );
              throw new Error(
                'Chat token response invalid - missing token field',
              );
            }

            const token = tokenData.token;
            logger.info(
              `${LOG_CONFIG_PREFIX} Chat token fetched successfully`,
              {
                tokenFirstChars: token.substring(0, 5) + '...',
                tokenLength: token.length,
                timestamp: new Date().toISOString(),
              },
            );

            // 3. Fetch chat info
            const apiUrl = `/api/chat/getChatInfo?memberId=${memberId}&memberType=${memberType}&planId=${planId}`;
            logger.info(`${LOG_CONFIG_PREFIX} Fetching chat info`, {
              apiUrl,
              timestamp: new Date().toISOString(),
            });

            const infoRes = await fetch(apiUrl, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            if (!infoRes.ok) {
              const errorMsg = `Failed to fetch chat info: ${infoRes.status} ${infoRes.statusText}`;
              logger.error(`${LOG_CONFIG_PREFIX} Chat info fetch failed`, {
                status: infoRes.status,
                statusText: infoRes.statusText,
              });
              throw new Error(errorMsg);
            }

            const info = await infoRes.json();

            if (!info) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Chat info response invalid or empty`,
              );
              throw new Error('Chat info response invalid or empty');
            }

            logger.info(`${LOG_CONFIG_PREFIX} Chat info fetched successfully`, {
              infoKeys: Object.keys(info),
              eligibility: info.isChatEligibleMember,
              cloudEligible: info.cloudChatEligible,
              timestamp: new Date().toISOString(),
            });

            // 4. NEW: Fetch PBE data for consent checking
            logger.info(`${LOG_CONFIG_PREFIX} Fetching PBE data for consent`);
            let hasConsent = false; // Default to false - safer approach

            if (process.env.CONSENT_ENABLED === 'true') {
              try {
                const userIdForPBE =
                  userContext?.subscriberId || String(memberId);
                if (!userIdForPBE) {
                  logger.warn(
                    `${LOG_CONFIG_PREFIX} Cannot check PBE consent, missing user identifier for PBE.`,
                  );
                  // hasConsent remains false
                } else {
                  logger.info(
                    `${LOG_CONFIG_PREFIX} Fetching PBE data for consent`,
                    { userIdForPBE },
                  );
                  const pbeData = await getPersonBusinessEntity(
                    userIdForPBE,
                    true, // needPBE
                    true, // needConsent
                    false, // refresh
                  );

                  if (
                    pbeData &&
                    pbeData.consentDetails &&
                    pbeData.consentDetails.length > 0
                  ) {
                    const now = new Date();
                    // Find active, non-expired consent for chat
                    const validChatConsent = pbeData.consentDetails.find(
                      (consent) =>
                        consent.status === 'active' &&
                        (consent.accessControl === 'PERMIT_ALL' ||
                          consent.accessControl === 'PERMIT') &&
                        new Date(consent.expiresOn) > now,
                      // Add specific chat consent identifier if available
                    );

                    if (validChatConsent) {
                      hasConsent = true;
                      logger.info(
                        `${LOG_CONFIG_PREFIX} Active PBE consent found for chat.`,
                        { consentId: validChatConsent.id },
                      );
                    } else {
                      logger.info(
                        `${LOG_CONFIG_PREFIX} No active/valid PBE consent found for chat in details.`,
                      );
                      // hasConsent remains false
                    }
                  } else {
                    logger.info(
                      `${LOG_CONFIG_PREFIX} No PBE consent details array returned or it was empty.`,
                    );
                    // hasConsent remains false
                  }
                }
              } catch (pbeError: any) {
                logger.error(
                  `${LOG_CONFIG_PREFIX} Error during PBE data fetch or processing. Assuming no consent.`,
                  {
                    errorMessage: pbeError.message,
                  },
                );
                hasConsent = false; // Ensure consent is false if PBE check fails
              }
            } else {
              logger.info(
                `${LOG_CONFIG_PREFIX} PBE Consent check is disabled via environment variable. Assuming consent.`,
              );
              hasConsent = true; // If consent system is turned off, consent is implied
            }

            // 5. Gather static config
            logger.info(`${LOG_CONFIG_PREFIX} Gathering static configuration`);
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
                `${LOG_CONFIG_PREFIX} Missing critical static config values`,
                {
                  hasCoBrowseLicence: !!staticConfig.coBrowseLicence,
                  hasCobrowseURL: !!staticConfig.cobrowseURL,
                },
              );
            }

            logger.info(
              `${LOG_CONFIG_PREFIX} Static config gathered successfully`,
              {
                staticConfigKeys: Object.keys(staticConfig),
                timestamp: new Date().toISOString(),
              },
            );

            // 6. Build GenesysChatConfig
            logger.info(`${LOG_CONFIG_PREFIX} Building GenesysChatConfig`);
            const genesysChatConfig = buildGenesysChatConfig({
              user,
              plan,
              apiConfig: { ...info, token },
              staticConfig,
            });

            if (!genesysChatConfig) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Failed to build GenesysChatConfig`,
              );
              throw new Error('Failed to build GenesysChatConfig');
            }

            // Validate critical fields in the generated config
            if (!genesysChatConfig.clickToChatToken) {
              logger.warn(
                `${LOG_CONFIG_PREFIX} Missing clickToChatToken in config`,
              );
            }

            if (!genesysChatConfig.clickToChatEndpoint) {
              logger.warn(
                `${LOG_CONFIG_PREFIX} Missing clickToChatEndpoint in config`,
              );
            }

            if (!genesysChatConfig.gmsChatUrl) {
              logger.warn(`${LOG_CONFIG_PREFIX} Missing gmsChatUrl in config`);
            }

            if (!genesysChatConfig.widgetUrl) {
              logger.warn(`${LOG_CONFIG_PREFIX} Missing widgetUrl in config`);
            }

            if (!genesysChatConfig.clickToChatJs) {
              logger.warn(
                `${LOG_CONFIG_PREFIX} Missing clickToChatJs in config`,
              );
            }

            logger.info(
              `${LOG_CONFIG_PREFIX} GenesysChatConfig built successfully`,
              {
                configKeys: Object.keys(genesysChatConfig),
                chatMode: genesysChatConfig.chatMode,
                isCloud: genesysChatConfig.chatMode === 'cloud',
                hasToken: !!genesysChatConfig.clickToChatToken,
                hasEndpoint: !!genesysChatConfig.clickToChatEndpoint,
                timestamp: new Date().toISOString(),
              },
            );

            // 7. Prepare chat data
            const chatData: ChatData = {
              isEligible: info.isEligible || false,
              cloudChatEligible: info.cloudChatEligible || false,
              chatAvailable: info.chatAvailable !== false,
              chatGroup: info.chatGroup || '',
              businessHours: {
                isOpen: info.chatAvailable ?? true, // Use the backend-provided flag for operational status
                text: info.workingHours || staticConfig.chatHours || '',
              },
              userData: {},
              formInputs: [],
            };

            // 8. Update all state at once to prevent multiple re-renders
            set((state) => ({
              config: {
                ...state.config,
                genesysChatConfig,
                chatData,
                hasConsent,
                isLoading: false,
                error: null,
                token,
              },
            }));

            logger.info(
              `${LOG_CONFIG_PREFIX} Chat configuration loaded successfully`,
              {
                timestamp: new Date().toISOString(),
              },
            );

            // After fetching 'info' from API, add the chatConfig validation:
            try {
              const validatedApiInfo = createGenesysConfig(info as any); // Cast if shape isn't an exact match
              set((state) => ({
                config: {
                  ...state.config,
                  chatConfig: validatedApiInfo, // Store the Zod-validated raw API info
                },
              }));
              logger.info(
                `${LOG_CONFIG_PREFIX} Raw API info validated and stored in chatConfig.`,
              );
            } catch (validationError: any) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Raw API info validation failed against ChatConfigSchema.`,
                {
                  error: validationError.message,
                  issues: validationError.errors, // Zod errors
                  rawData: info,
                },
              );
              // Continue - validation failure should be logged but not block chat
            }
          } catch (err: any) {
            const errorObj =
              err instanceof Error ? err : new Error(String(err));
            logger.error(
              `${LOG_CONFIG_PREFIX} Error loading chat configuration`,
              {
                error: errorObj.message,
                stack: errorObj.stack,
                timestamp: new Date().toISOString(),
              },
            );
            set((state) => ({
              config: {
                ...state.config,
                isLoading: false,
                error: errorObj,
              },
            }));
          }
        },
      ),
    },
  };
});

logger.info(`${LOG_STORE_PREFIX} Chat store created.`);
