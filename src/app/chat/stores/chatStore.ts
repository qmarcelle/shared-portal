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
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import { getChatInfo } from '../api';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
  PlanConfig,
  UserConfig,
} from '../genesysChatConfig';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { ChatSettings, ScriptLoadPhase } from '../types/chat-types';
import { updateApiState } from '../utils/chatSequentialLoader';

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
    buttonState: 'not-attempted' | 'creating' | 'created' | 'failed';
  };

  // Config state domain
  config: {
    isLoading: boolean;
    error: Error | null;
    genesysChatConfig?: GenesysChatConfig;
    // Legacy chat config
    legacyConfig?: ChatSettings;
    // Cloud chat config
    cloudConfig?: {
      environment: string;
      deploymentId: string;
      customAttributes?: {
        Firstname?: string;
        lastname?: string;
        MEMBER_ID?: string;
        MEMBER_DOB?: string;
        GROUP_ID?: string;
        PLAN_ID?: string;
        INQ_TYPE?: string;
        isMedicalEligible?: string;
        IsDentalEligible?: string;
        IsVisionEligible?: string;
        IDCardBotName?: string;
        LOB?: string;
      };
    };
    chatData: ChatData | null;
    chatConfig?: ChatConfig;
    token?: string;
  };

  // Session state domain
  session: {
    isChatActive: boolean;
    messages: Array<{ id: string; content: string; sender: 'user' | 'agent' }>;
    isPlanSwitcherLocked: boolean;
    planSwitcherTooltip: string;
    standardErrorMessage: string; // Standard message for chat failures
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
    setButtonState: (
      buttonState: 'not-attempted' | 'creating' | 'created' | 'failed',
    ) => void;

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
  workingHours?: string;
  userData?: Record<string, string>;
  formInputs?: { id: string; value: string }[];
  rawChatHrs?: string;
  genesysCloudConfig?: {
    deploymentId: string;
    environment: string;
    orgId?: string;
    customAttributes?: {
      Firstname?: string;
      lastname?: string;
      MEMBER_ID?: string;
      MEMBER_DOB?: string;
      GROUP_ID?: string;
      PLAN_ID?: string;
      INQ_TYPE?: string;
      isMedicalEligible?: string;
      IsDentalEligible?: string;
      IsVisionEligible?: string;
      IDCardBotName?: string;
      LOB?: string;
    };
  };
  routingInteractionId?: string;
}

// Selectors for derived state - these don't cause re-renders when other state changes
export const chatUISelectors = {
  isOpen: (state: ChatState) => state.ui.isOpen,
  isMinimized: (state: ChatState) => state.ui.isMinimized,
  newMessageCount: (state: ChatState) => state.ui.newMessageCount,
  buttonState: (state: ChatState) => state.ui.buttonState,
};

export const chatConfigSelectors = {
  isLoading: (state: ChatState) => state.config.isLoading,
  error: (state: ChatState) => state.config.error,
  genesysChatConfig: (state: ChatState) => {
    if (state.config.chatData?.cloudChatEligible) {
      return state.config.cloudConfig;
    }
    return state.config.legacyConfig;
  },
  isEligible: (state: ChatState) => state.config.chatData?.isEligible || false,
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
  isChatEnabled: (state: ChatState) => {
    // Simplified to only check the core eligibility factors
    return (
      state.config.chatData?.isEligible === true &&
      state.config.chatData?.chatAvailable === true
    );
  },
  genesysCloudDeploymentConfig: (state: ChatState) =>
    state.config.chatData?.genesysCloudConfig,
};

export const chatSessionSelectors = {
  isChatActive: (state: ChatState) => state.session.isChatActive,
  messages: (state: ChatState) => state.session.messages,
  isPlanSwitcherLocked: (state: ChatState) =>
    state.session.isPlanSwitcherLocked,
  planSwitcherTooltip: (state: ChatState) => state.session.planSwitcherTooltip,
  standardErrorMessage: (state: ChatState) =>
    state.session.standardErrorMessage,
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
      buttonState: 'not-attempted',
    },

    // Config state
    config: {
      isLoading: false,
      error: null,
      genesysChatConfig: undefined,
      chatData: null,
      chatConfig: undefined,
      token: undefined,
    },

    // Session state
    session: {
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
      planSwitcherTooltip: '',
      standardErrorMessage:
        'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.',
    },

    // Script state
    scripts: {
      scriptLoadPhase: ScriptLoadPhase.INIT,
    },

    // Actions implementation
    actions: {
      // UI actions
      setOpen: makeStable((isOpen: boolean) => {
        const prevState = get().ui.isOpen;
        logger.info(
          `${LOG_UI_PREFIX} setOpen(${isOpen}), previous state: ${prevState}`,
        );
        set((state) => ({ ui: { ...state.ui, isOpen } }));
      }),

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

      // Add button state action
      setButtonState: makeStable(
        (buttonState: 'not-attempted' | 'creating' | 'created' | 'failed') => {
          const prevState = get().ui.buttonState;
          logger.info(
            `${LOG_UI_PREFIX} setButtonState(${buttonState}), previous state: ${prevState}`,
          );
          set((state) => ({ ui: { ...state.ui, buttonState } }));
        },
      ),

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
            { memberId, planId, memberType },
          );
          set((state) => ({
            config: { ...state.config, isLoading: true, error: null },
          }));

          try {
            logger.info(
              `${LOG_CONFIG_PREFIX} Attempting to fetch chat configurations and context.`,
              { memberId, planId, memberType },
            );

            // 1. Fetch Chat Info (from /api/chat/getChatInfo)
            const chatInfoResponse = await getChatInfo(
              String(memberId), // Ensure memberId is string for API
              planId,
              memberType, // Pass memberType; API must handle if optional
            );
            logger.info(`${LOG_CONFIG_PREFIX} Raw chatInfoResponse:`, {
              data: chatInfoResponse,
            });

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
              // For now, proceed; buildGenesysChatConfig might handle defaults
            } else {
              logger.info(
                `${LOG_CONFIG_PREFIX} Successfully validated raw chatInfo API response.`,
                { data: parsedChatInfo.data },
              );
            }
            const rawApiDataForConfig = chatInfoResponse; // Use original response for flexibility in buildGenesysChatConfig

            // NOTE: PBE consent check was removed since it's not currently needed
            // Always setting hasConsent to true for backward compatibility
            const pbeConsent = true;

            // Log the userContext before calling buildGenesysChatConfig
            logger.info(
              `${LOG_CONFIG_PREFIX} userContext before calling buildGenesysChatConfig:`,
              userContext,
            );

            // 4. Build the final GenesysChatConfig DTO
            const finalGenesysConfig = buildGenesysChatConfig({
              apiConfig: rawApiDataForConfig,
              user: userContext || { userID: 'fallbackUserID' },
              plan: planContext || { memberMedicalPlanID: 'fallbackPlanID' },
            });

            logger.info(`${LOG_CONFIG_PREFIX} Final genesysChatConfig built:`, {
              configKeys: Object.keys(finalGenesysConfig),
              chatMode: finalGenesysConfig.chatMode,
              userID: finalGenesysConfig.userID,
            });

            // Update sequential loader state with final config
            logger.info(
              `${LOG_CONFIG_PREFIX} Explicitly updating sequential loader state with eligibility check.`,
            );
            const isEligible =
              finalGenesysConfig.isChatEligibleMember as boolean;
            const mode =
              finalGenesysConfig.chatMode === 'cloud' ? 'cloud' : 'legacy';
            // Ensure the sequential loader is updated with correct state
            updateApiState(isEligible, mode);

            // 5. Update Zustand state with the final configuration
            set({
              config: {
                ...get().config,
                genesysChatConfig: finalGenesysConfig,
                // Set the appropriate config based on chat mode
                legacyConfig:
                  finalGenesysConfig.chatMode === 'legacy'
                    ? (finalGenesysConfig as unknown as ChatSettings)
                    : undefined,
                cloudConfig:
                  finalGenesysConfig.chatMode === 'cloud'
                    ? {
                        environment:
                          (rawApiDataForConfig.genesysCloudConfig as any)
                            ?.environment || '',
                        deploymentId: finalGenesysConfig.deploymentId || '',
                        // Only include properties defined in the ChatState interface for cloudConfig
                        customAttributes: {
                          Firstname:
                            finalGenesysConfig.formattedFirstName ||
                            finalGenesysConfig.memberFirstname,
                          lastname: finalGenesysConfig.memberLastName,
                          MEMBER_ID:
                            finalGenesysConfig.MEMBER_ID ||
                            `${finalGenesysConfig.subscriberID || ''}-${finalGenesysConfig.sfx || ''}`,
                          MEMBER_DOB: finalGenesysConfig.memberDOB,
                          GROUP_ID: finalGenesysConfig.groupId,
                          PLAN_ID: finalGenesysConfig.memberMedicalPlanID,
                          INQ_TYPE: finalGenesysConfig.INQ_TYPE,
                          LOB: finalGenesysConfig.LOB,
                        },
                      }
                    : undefined,
                isLoading: false,
                error: null,
                chatData: {
                  isEligible:
                    finalGenesysConfig.isChatEligibleMember as boolean,
                  cloudChatEligible: finalGenesysConfig.chatMode === 'cloud',
                  chatAvailable: finalGenesysConfig.isChatAvailable as boolean,
                  chatGroup: finalGenesysConfig.chatGroup,
                  workingHours: finalGenesysConfig.workingHours,
                  rawChatHrs: finalGenesysConfig.rawChatHrs,
                  genesysCloudConfig: {
                    deploymentId: finalGenesysConfig.deploymentId || '',
                    environment:
                      (rawApiDataForConfig.genesysCloudConfig as any)
                        ?.environment || '',
                    orgId: finalGenesysConfig.orgId || '',
                  },
                },
              },
            });

            // 6. Populate window.chatSettings for click_to_chat.js
            if (typeof window !== 'undefined') {
              window.chatSettings = finalGenesysConfig as any;
              if (window.chatSettings) {
                logger.info(
                  `${LOG_CONFIG_PREFIX} window.chatSettings has been populated.`,
                  {
                    chatMode: window.chatSettings.chatMode,
                    hasToken: !!window.chatSettings.clickToChatToken,
                    deploymentId: window.chatSettings.deploymentId,
                    orgId: window.chatSettings.orgId,
                    isChatEligibleMember:
                      window.chatSettings.isChatEligibleMember,
                    isChatAvailable: window.chatSettings.isChatAvailable,
                  },
                );
              }
            }

            // Mark chat as ready to be initialized by ChatClientEntry
            logger.info(
              `${LOG_CONFIG_PREFIX} Chat store updated with new configuration.`,
            );
          } catch (error: any) {
            logger.error(
              `${LOG_CONFIG_PREFIX} Error during loadChatConfiguration:`,
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
                genesysChatConfig: undefined,
                chatData: null,
              },
            }));
          } finally {
            logger.info(
              `${LOG_CONFIG_PREFIX} loadChatConfiguration finished. Setting isLoading to false.`,
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
