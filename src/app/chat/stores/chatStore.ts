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
import { ConsentDetail, PBEData } from '@/models/member/api/pbeData';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import { ChatInfoResponse, getChatInfo } from '../api';
import {
  buildGenesysChatConfig,
  PlanConfig,
  UserConfig,
} from '../genesysChatConfig';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
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
      userContext?: UserConfig | any,
      planContext?: PlanConfig | any,
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
      isLoading: false,
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
          memberType?: string,
          userContext?: UserConfig | any,
          planContext?: PlanConfig | any,
        ) => {
          logger.info(
            `${LOG_CONFIG_PREFIX} loadChatConfiguration: Action initiated.`,
            {
              memberId,
              planId,
              memberType,
              userContextPassed: !!userContext,
              planContextPassed: !!planContext,
            },
          );
          set((state) => ({
            config: { ...state.config, isLoading: true, error: null },
          }));

          let rawApiDataForConfig: ChatInfoResponse | undefined; // To store API response for later use
          let pbeConsent = true; // Default consent
          let pbeError: Error | null = null;
          let finalGenesysConfig: GenesysChatConfig | undefined;
          let validatedChatInfoData: ChatConfig | undefined; // Store validated data

          try {
            logger.info(
              `${LOG_CONFIG_PREFIX} Attempting to fetch chat configurations and context.`,
              { memberId, planId, memberType },
            );

            // 1. Fetch Chat Info (from /api/chat/getChatInfo)
            const chatInfoResponse = await getChatInfo(
              String(memberId),
              planId,
              memberType,
            );
            logger.info(
              `${LOG_CONFIG_PREFIX} Raw chatInfoResponse received from getChatInfo:`,
              { data: chatInfoResponse },
            );
            rawApiDataForConfig = chatInfoResponse; // Assign for later use

            // 2. Validate raw chatInfoResponse
            const parsedChatInfo = ChatConfigSchema.safeParse(chatInfoResponse);

            if (!parsedChatInfo.success) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Failed to validate raw chatInfo API response.`,
                {
                  errors: parsedChatInfo.error.errors,
                  rawData: chatInfoResponse,
                },
              );
              // Consider how to handle this. If validation is critical, might throw or set error.
              // For now, logging and proceeding, buildGenesysChatConfig might handle defaults.
            } else {
              logger.info(
                `${LOG_CONFIG_PREFIX} Successfully validated raw chatInfo API response.`,
                { data: parsedChatInfo.data },
              );
              validatedChatInfoData = parsedChatInfo.data; // Store successfully parsed data
            }

            // 3. Fetch PBE Consent
            const userIdForPBE = userContext?.subscriberId || String(memberId);
            logger.info(`${LOG_CONFIG_PREFIX} Determining PBE consent.`, {
              NEXT_PUBLIC_CONSENT_ENABLED:
                process.env.NEXT_PUBLIC_CONSENT_ENABLED,
              userIdForPBE,
            });

            if (
              process.env.NEXT_PUBLIC_CONSENT_ENABLED === 'true' &&
              userIdForPBE
            ) {
              try {
                logger.info(
                  `${LOG_CONFIG_PREFIX} Fetching PBE data for consent...`,
                  { userIdForPBE },
                );
                const pbeResponse: PBEData = await getPersonBusinessEntity(
                  userIdForPBE,
                  true,
                  true,
                  false,
                );
                logger.info(`${LOG_CONFIG_PREFIX} PBE Response received:`, {
                  pbeResponse,
                });

                if (
                  pbeResponse?.consentDetails &&
                  Array.isArray(pbeResponse.consentDetails) &&
                  pbeResponse.consentDetails.length > 0
                ) {
                  const now = new Date();
                  const validChatConsent = pbeResponse.consentDetails.find(
                    (consent: ConsentDetail) =>
                      consent.status === 'active' &&
                      (consent.accessControl === 'PERMIT_ALL' ||
                        consent.accessControl === 'PERMIT') &&
                      new Date(consent.expiresOn) > now,
                  );
                  pbeConsent = !!validChatConsent;
                  logger.info(
                    `${LOG_CONFIG_PREFIX} PBE consent determined: ${pbeConsent}`,
                    { validChatConsentDetails: validChatConsent, pbeResponse },
                  );
                } else {
                  logger.warn(
                    `${LOG_CONFIG_PREFIX} PBE consent data not in expected format or missing. Defaulting consent to false.`,
                    { pbeResponse },
                  );
                  pbeConsent = false;
                }
              } catch (err: any) {
                logger.error(
                  `${LOG_CONFIG_PREFIX} Failed to fetch PBE consent. Assuming no consent.`,
                  { error: err.message, stack: err.stack },
                );
                pbeError = err instanceof Error ? err : new Error(String(err));
                pbeConsent = false;
              }
            } else if (
              process.env.NEXT_PUBLIC_CONSENT_ENABLED === 'true' &&
              !userIdForPBE
            ) {
              logger.warn(
                `${LOG_CONFIG_PREFIX} Cannot check PBE consent, missing userIdForPBE. Assuming no consent.`,
              );
              pbeConsent = false;
            } else {
              logger.info(
                `${LOG_CONFIG_PREFIX} PBE consent check skipped or NEXT_PUBLIC_CONSENT_ENABLED is not 'true'. Current pbeConsent: ${pbeConsent} (initial default).`,
              );
            }

            // 4. Build the final GenesysChatConfig DTO
            // Ensure rawApiDataForConfig is used, as it's the direct API output
            logger.info(
              `${LOG_CONFIG_PREFIX} Preparing to build finalGenesysConfig.`,
              {
                apiConfigAvailable: !!rawApiDataForConfig,
                userContextAvailable: !!userContext,
                planContextAvailable: !!planContext,
              },
            );

            if (!rawApiDataForConfig) {
              throw new Error(
                'API configuration (rawApiDataForConfig) is missing, cannot build GenesysChatConfig.',
              );
            }

            finalGenesysConfig = buildGenesysChatConfig({
              apiConfig: rawApiDataForConfig,
              user: userContext || {},
              plan: planContext || {},
            });

            logger.info(
              `${LOG_CONFIG_PREFIX} Final genesysChatConfig successfully built:`,
              { config: finalGenesysConfig },
            );

            // 5. Determine overall chat eligibility and availability from finalGenesysConfig
            // These were previously derived from finalGenesysConfig, let's ensure this logic is sound.
            if (!finalGenesysConfig) {
              // This case should ideally be caught by the !rawApiDataForConfig check or if buildGenesysChatConfig fails
              logger.error(
                `${LOG_CONFIG_PREFIX} Critical: finalGenesysConfig is unexpectedly undefined after build. Throwing error.`,
              );
              throw new Error(
                'finalGenesysConfig was not populated after build step.',
              );
            }

            const isEligible =
              finalGenesysConfig.isChatEligibleMember === 'true';
            const chatAvailable = finalGenesysConfig.isChatAvailable === 'true'; // Or use chatHours logic
            const determinedChatGroup =
              rawApiDataForConfig?.chatGroup ||
              finalGenesysConfig.chatGroup ||
              '';
            const chatMode = finalGenesysConfig.chatMode === 'cloud'; // cloud or legacy

            logger.info(`${LOG_CONFIG_PREFIX} Derived chat properties:`, {
              isEligible,
              chatAvailable,
              determinedChatGroup,
              chatMode,
              pbeConsent, // Log the final pbeConsent value to be set
            });

            // 6. Update store
            logger.info(
              `${LOG_CONFIG_PREFIX} Preparing to update chat store with new configuration.`,
              {
                finalGenesysConfigAvailable: !!finalGenesysConfig,
                chatDataIsEligible:
                  finalGenesysConfig?.isChatEligibleMember === 'true',
                chatDataChatAvailable:
                  finalGenesysConfig?.isChatAvailable === 'true',
                chatDataChatGroup:
                  finalGenesysConfig?.chatGroup ||
                  rawApiDataForConfig?.chatGroup ||
                  '',
                chatDataBusinessHoursOpen:
                  finalGenesysConfig?.isChatAvailable === 'true',
                chatDataBusinessHoursText: finalGenesysConfig?.chatHours || '',
                validatedChatInfoDataAvailable: !!validatedChatInfoData,
                finalPbeConsent: pbeConsent,
                pbeErrorToSet: pbeError?.message,
              },
            );

            set((state) => {
              const newConfig = { ...state.config };
              if (finalGenesysConfig) {
                newConfig.genesysChatConfig = finalGenesysConfig;
                newConfig.chatData = {
                  isEligible:
                    finalGenesysConfig.isChatEligibleMember === 'true',
                  cloudChatEligible: finalGenesysConfig.chatMode === 'cloud',
                  chatAvailable: finalGenesysConfig.isChatAvailable === 'true',
                  chatGroup:
                    rawApiDataForConfig?.chatGroup ||
                    finalGenesysConfig.chatGroup ||
                    '',
                  businessHours: {
                    isOpen: finalGenesysConfig.isChatAvailable === 'true',
                    text: finalGenesysConfig.chatHours || '',
                  },
                  userData: {},
                  formInputs: [],
                  routingInteractionId:
                    rawApiDataForConfig?.routingInteractionId,
                };
              }
              newConfig.chatConfig = validatedChatInfoData; // Store the Zod validated data
              newConfig.hasConsent = pbeConsent;
              newConfig.error = pbeError || state.config.error; // Preserve existing error if pbeError is null

              return {
                config: newConfig,
              };
            });
            logger.info(
              `${LOG_CONFIG_PREFIX} Chat store updated with new configuration. isChatEnabled should now be: ${chatConfigSelectors.isChatEnabled(get())}`,
            );
          } catch (error: any) {
            logger.error(
              `${LOG_CONFIG_PREFIX} Critical error during loadChatConfiguration:`,
              {
                message: error.message,
                stack: error.stack,
              },
            );
            set((state) => ({
              config: {
                ...state.config,
                error:
                  error instanceof Error ? error : new Error(String(error)),
                genesysChatConfig: undefined, // Clear on critical error
                chatData: null, // Clear on critical error
                hasConsent: false, // Assume no consent on critical error if PBE was involved
              },
            }));
          } finally {
            logger.info(
              `${LOG_CONFIG_PREFIX} loadChatConfiguration finished. Setting isLoading to false. Current error state: ${get().config.error?.message}`,
            );
            set((state) => ({
              config: { ...state.config, isLoading: false },
            }));
          }
        },
      ),
    },
  };
});

logger.info(`${LOG_STORE_PREFIX} Chat store created.`);
