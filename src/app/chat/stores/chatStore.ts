// src/stores/chatStore.ts
/**
 * @file chatStore.ts
 * @description Centralized Zustand store for managing all Genesys chat-related state and actions.
 */
import type { LoggedInMember } from '@/models/app/loggedin_member'; // Import the rich models
import type { UserProfile } from '@/models/user_profile';
import type { SessionUser } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import { create } from 'zustand';
import { getChatInfo } from '../api';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
} from '../config/genesysChatConfig';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import {
  ChatSettings,
  CloudChatConfig,
  ScriptLoadPhase,
} from '../types/chat-types'; // ChatSettings is LegacyChatConfig, import CloudChatConfig here
import { updateApiState } from '../utils/chatSequentialLoader';

const LOG_STORE_PREFIX = '[ChatStore]';
const LOG_UI_PREFIX = '[ChatStore:UI]';
const LOG_CONFIG_PREFIX = '[ChatStore:Config]';
const LOG_SESSION_PREFIX = '[ChatStore:Session]';
const LOG_SCRIPT_PREFIX = '[ChatStore:Script]';

function makeStable<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

// Define the structure for current plan details needed by buildGenesysChatConfig
export interface CurrentPlanDetails {
  numberOfPlans: number;
  currentPlanName: string;
  currentPlanLOB?: string; // Optional: Line of Business for the current plan
  // Add other plan-specific details needed by buildGenesysChatConfig if not in SessionUser.currUsr.plan
}

interface ChatState {
  ui: {
    isOpen: boolean;
    isMinimized: boolean;
    newMessageCount: number;
    buttonState: 'not-attempted' | 'creating' | 'created' | 'failed';
    isPlanSwitcherModalOpen: boolean;
    isTnCModalOpen: boolean;
    tnCModalLOB: string | null;
    isPreChatModalOpen: boolean;
  };
  config: {
    isLoading: boolean;
    error: Error | null;
    genesysChatConfig?: GenesysChatConfig; // This will hold the output of buildGenesysChatConfig
    legacyConfig?: ChatSettings; // Derived from genesysChatConfig if legacy
    cloudConfig?: {
      // Derived from genesysChatConfig if cloud
      environment: string;
      deploymentId: string;
      customAttributes?: Record<string, string | undefined>; // Simplified customAttributes
    };
    chatData: ChatData | null; // Holds processed/subset of API response for UI binding
    chatConfig?: ChatConfig; // Zod validated raw API response
    token?: string; // Potentially from API response or session
  };
  session: {
    isChatActive: boolean;
    messages: Array<{ id: string; content: string; sender: 'user' | 'agent' }>;
    isPlanSwitcherLocked: boolean;
    planSwitcherTooltip: string;
    standardErrorMessage: string;
    chatSessionId: string | null;
    lastActivityTimestamp: number | null;
    planSwitcherTooltipMessage: string;
  };
  scripts: {
    scriptLoadPhase: ScriptLoadPhase;
  };
  actions: {
    setOpen: (isOpen: boolean) => void;
    setMinimized: (min: boolean) => void;
    minimizeChat: () => void;
    maximizeChat: () => void;
    incrementMessageCount: () => void;
    resetMessageCount: () => void;
    setButtonState: (
      buttonState: 'not-attempted' | 'creating' | 'created' | 'failed',
    ) => void;
    setError: (err: Error | null) => void;
    loadChatConfiguration: (
      // Parameters needed for the getChatInfo API call
      apiCallMemberId: string, // Specific ID for the API call (e.g., memeck)
      apiCallPlanId: string, // Specific Plan ID for the API call

      // Full data models now passed directly
      loggedInMember: LoggedInMember,
      sessionUser: SessionUser,
      userProfile: UserProfile,
      currentPlanDetails: CurrentPlanDetails,
    ) => Promise<void>;
    setChatActive: (isActive: boolean, sessionId?: string) => void;
    setChatInactive: () => void;
    updateLastActivity: () => void;
    setLoading: (loading: boolean) => void;
    addMessage: (m: { content: string; sender: 'user' | 'agent' }) => void;
    clearMessages: () => void;
    setPlanSwitcherLocked: (
      locked: boolean,
      message?: string, // Optional message, defaults will be used if not provided
    ) => void;
    closeAndRedirect: () => void;
    startChat: () => void;
    endChat: () => void;
    setScriptLoadPhase: (phase: ScriptLoadPhase) => void;
    openPlanSwitcherModal: () => void;
    closePlanSwitcherModal: () => void;
    openTnCModal: (lob: string) => void;
    closeTnCModal: () => void;
    openPreChatModal: () => void;
    closePreChatModal: () => void;
    resetConfig: () => void;
  };
}

interface ChatData {
  // This seems to be a processed subset of the API response for UI
  isEligible: boolean;
  cloudChatEligible: boolean;
  chatAvailable?: boolean;
  chatGroup?: string;
  businessHours?: { isOpen: boolean; text: string }; // Consider deriving this from rawChatHrs or workingHours
  workingHours?: string; // From API
  rawChatHrs?: string; // From API
  genesysCloudConfig?: {
    // From API, then supplemented by env vars in buildGenesysChatConfig
    deploymentId: string;
    environment: string;
    orgId?: string;
  };
  routingInteractionId?: string; // From API
  // Removed userData and formInputs as these are usually part of GenesysChatConfig for the widget
}

export const chatUISelectors = {
  /* ... (no changes needed here based on prompt) ... */
};
export const chatConfigSelectors = {
  isLoading: (state: ChatState) => state.config.isLoading,
  error: (state: ChatState) => state.config.error,
  genesysChatConfig: (state: ChatState) => state.config.genesysChatConfig, // Simplified from previous
  isEligible: (state: ChatState) => state.config.chatData?.isEligible || false,
  chatMode: (state: ChatState) => state.config.genesysChatConfig?.chatMode,
  isOOO: (state: ChatState) =>
    !(state.config.chatData?.businessHours?.isOpen ?? false),
  chatGroup: (state: ChatState) => state.config.chatData?.chatGroup,
  businessHoursText: (state: ChatState) =>
    state.config.chatData?.businessHours?.text || '',
  isChatEnabled: (state: ChatState) => {
    return (
      state.config.chatData?.isEligible === true &&
      state.config.chatData?.chatAvailable === true
    );
  },
  // Add other selectors from the original if they are still relevant and used
};
export const chatSessionSelectors = {
  /* ... (no changes needed here based on prompt) ... */
};
export const chatScriptSelectors = {
  /* ... (no changes needed here based on prompt) ... */
};

export const useChatStore = create<ChatState>((set, get) => {
  logger.info(`${LOG_STORE_PREFIX} Initializing chat store...`);

  return {
    ui: {
      isOpen: false,
      isMinimized: false,
      newMessageCount: 0,
      buttonState: 'not-attempted',
      isPlanSwitcherModalOpen: false,
      isTnCModalOpen: false,
      tnCModalLOB: null,
      isPreChatModalOpen: false,
    },
    config: {
      isLoading: false,
      error: null,
      genesysChatConfig: undefined,
      legacyConfig: undefined,
      cloudConfig: undefined,
      chatData: null,
      chatConfig: undefined, // To store Zod validated raw API response
      token: undefined,
    },
    session: {
      isChatActive: false,
      messages: [],
      isPlanSwitcherLocked: false,
      planSwitcherTooltip: 'End your chat session to switch plan information.',
      standardErrorMessage:
        'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.',
      chatSessionId: null,
      lastActivityTimestamp: null,
      planSwitcherTooltipMessage:
        'End your chat session to switch plan information.',
    },
    scripts: { scriptLoadPhase: ScriptLoadPhase.INIT },

    actions: {
      setOpen: makeStable((isOpen: boolean) => {
        const prevState = get().ui.isOpen;
        logger.info(
          `${LOG_UI_PREFIX} setOpen(${isOpen}), previous state: ${prevState}`,
        );
        set((state) => ({ ui: { ...state.ui, isOpen } }));
      }),
      setMinimized: (min) => {
        logger.info(`${LOG_UI_PREFIX} setMinimized called`, { min });
        set((state) => ({ ui: { ...state.ui, isMinimized: min } }));
      },
      minimizeChat: () => {
        logger.info(`${LOG_UI_PREFIX} minimizeChat called`);
        set((state) => ({ ui: { ...state.ui, isMinimized: true } }));
      },
      maximizeChat: () => {
        logger.info(`${LOG_UI_PREFIX} maximizeChat called`);
        set((state) => ({ ui: { ...state.ui, isMinimized: false } }));
      },
      incrementMessageCount: () => {
        logger.info(`${LOG_UI_PREFIX} incrementMessageCount called`);
        set((state) => ({
          ui: { ...state.ui, newMessageCount: state.ui.newMessageCount + 1 },
        }));
      },
      resetMessageCount: () => {
        logger.info(`${LOG_UI_PREFIX} resetMessageCount called`);
        set((state) => ({ ui: { ...state.ui, newMessageCount: 0 } }));
      },
      setButtonState: makeStable(
        (buttonState: 'not-attempted' | 'creating' | 'created' | 'failed') => {
          const prevState = get().ui.buttonState;
          logger.info(
            `${LOG_UI_PREFIX} setButtonState(${buttonState}), previous state: ${prevState}`,
          );
          set((state) => ({ ui: { ...state.ui, buttonState } }));
        },
      ),
      setError: makeStable((err: Error | null) => {
        const prevError = get().config.error;
        logger.error(`${LOG_CONFIG_PREFIX} setError called`, {
          newError: err,
          prevError,
        });
        set((state) => ({
          config: {
            ...state.config,
            error: err,
            isLoading: false, // Ensure loading is stopped on error
            // Potentially clear other config fields on critical error
            genesysChatConfig: err ? undefined : state.config.genesysChatConfig,
            legacyConfig: err ? undefined : state.config.legacyConfig,
            cloudConfig: err ? undefined : state.config.cloudConfig,
            chatData: err ? null : state.config.chatData,
          },
        })); // Ensure isLoading is false on error
      }),
      loadChatConfiguration: makeStable(
        async (
          apiCallMemberId: string,
          apiCallPlanId: string,
          loggedInMember: LoggedInMember,
          sessionUser: SessionUser,
          userProfile: UserProfile,
          currentPlanDetails: CurrentPlanDetails,
        ) => {
          logger.info(
            `${LOG_CONFIG_PREFIX} loadChatConfiguration: Action initiated.`,
            {
              apiCallMemberId,
              apiCallPlanId,
              currentPlanName: currentPlanDetails.currentPlanName,
            },
          );
          set((state) => ({
            config: { ...state.config, isLoading: true, error: null },
          }));

          try {
            const memberTypeForApi = sessionUser.currUsr?.role;

            logger.info(
              `${LOG_CONFIG_PREFIX} Attempting to fetch chat configurations via getChatInfo.`,
              { apiCallMemberId, apiCallPlanId, memberTypeForApi },
            );
            const chatInfoResponse = await getChatInfo(
              apiCallMemberId,
              apiCallPlanId,
              memberTypeForApi,
            );
            logger.info(
              `${LOG_CONFIG_PREFIX} Raw chatInfoResponse from getChatInfo API:`,
              JSON.parse(JSON.stringify(chatInfoResponse)), // Deep clone for reliable logging of the raw object
            );
            logger.info(
              `${LOG_CONFIG_PREFIX} Raw chatInfoResponse (ApiConfig source):`,
              {
                data: chatInfoResponse,
              },
            );

            const parsedChatInfo = ChatConfigSchema.safeParse(chatInfoResponse);
            if (!parsedChatInfo.success) {
              logger.error(
                `${LOG_CONFIG_PREFIX} Failed to validate raw chatInfo API response against ChatConfigSchema.`,
                {
                  errors: parsedChatInfo.error.errors,
                  rawData: chatInfoResponse,
                },
              );
            } else {
              logger.info(
                `${LOG_CONFIG_PREFIX} Successfully validated raw chatInfo API response.`,
                { data: parsedChatInfo.data },
              );
            }
            const rawApiDataForConfig = chatInfoResponse;

            logger.info(
              `${LOG_CONFIG_PREFIX} Data for buildGenesysChatConfig:`,
              {
                loggedInMember,
                sessionUser,
                userProfile,
                rawApiDataForConfig,
                currentPlanDetails,
              },
            );

            const finalGenesysConfig = buildGenesysChatConfig({
              apiConfig: rawApiDataForConfig,
              loggedInMember,
              sessionUser,
              userProfile,
              currentPlanDetails,
            });
            logger.info(`${LOG_CONFIG_PREFIX} Final genesysChatConfig built:`, {
              chatMode: finalGenesysConfig.chatMode,
              userID: finalGenesysConfig.userID,
              numberOfPlans: finalGenesysConfig.numberOfPlans,
              currentPlanName: finalGenesysConfig.currentPlanName,
              LOB: finalGenesysConfig.LOB,
              INQ_TYPE: finalGenesysConfig.INQ_TYPE,
            });

            updateApiState(
              finalGenesysConfig.isChatEligibleMember as boolean,
              finalGenesysConfig.chatMode === 'cloud' ? 'cloud' : 'legacy',
            );

            set((state) => ({
              config: {
                ...state.config,
                genesysChatConfig: finalGenesysConfig,
                legacyConfig:
                  finalGenesysConfig.chatMode === 'legacy'
                    ? (finalGenesysConfig as unknown as ChatSettings)
                    : undefined,
                cloudConfig:
                  finalGenesysConfig.chatMode === 'cloud'
                    ? {
                        environment:
                          (finalGenesysConfig as unknown as CloudChatConfig)
                            .environment || '',
                        deploymentId:
                          (finalGenesysConfig as unknown as CloudChatConfig)
                            .deploymentId || '',
                        customAttributes: {
                          Firstname:
                            finalGenesysConfig.formattedFirstName ||
                            finalGenesysConfig.memberFirstname,
                          lastname: finalGenesysConfig.memberLastName,
                          MEMBER_ID: finalGenesysConfig.MEMBER_ID,
                          MEMBER_DOB: finalGenesysConfig.memberDOB,
                          GROUP_ID: finalGenesysConfig.groupId,
                          PLAN_ID: finalGenesysConfig.memberMedicalPlanID,
                          INQ_TYPE: finalGenesysConfig.INQ_TYPE,
                          LOB: finalGenesysConfig.LOB,
                          lob_group: (finalGenesysConfig as any).lob_group,
                          SERV_Type: (finalGenesysConfig as any).SERV_Type,
                          RoutingChatbotInteractionId: (
                            finalGenesysConfig as any
                          ).RoutingChatbotInteractionId,
                          IDCardBotName: finalGenesysConfig.idCardChatBotName,
                          IsVisionEligible: String(finalGenesysConfig.isVision),
                          coverage_eligibility: (finalGenesysConfig as any)
                            .coverage_eligibility,
                          IsDentalEligible: String(finalGenesysConfig.isDental),
                          IsMedicalEligible: String(
                            finalGenesysConfig.isMedical,
                          ),
                          Origin: (finalGenesysConfig as any).Origin,
                          'Source of chat': (finalGenesysConfig as any)[
                            'Source of chat'
                          ],
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
                  genesysCloudConfig:
                    finalGenesysConfig.chatMode === 'cloud'
                      ? {
                          deploymentId:
                            (finalGenesysConfig as unknown as CloudChatConfig)
                              .deploymentId || '',
                          environment:
                            (finalGenesysConfig as unknown as CloudChatConfig)
                              .environment || '',
                          orgId:
                            (finalGenesysConfig as unknown as CloudChatConfig)
                              .orgId || '',
                        }
                      : undefined,
                  routingInteractionId: (rawApiDataForConfig as any)
                    ?.routingInteractionId,
                },
                chatConfig: parsedChatInfo.success
                  ? parsedChatInfo.data
                  : undefined,
                token: finalGenesysConfig.clickToChatToken,
              },
            }));

            if (typeof window !== 'undefined') {
              window.chatSettings = finalGenesysConfig as any;
              if (window.chatSettings) {
                logger.info(
                  `${LOG_CONFIG_PREFIX} window.chatSettings has been populated for legacy mode.`,
                  {
                    chatMode: window.chatSettings.chatMode,
                    keys: Object.keys(window.chatSettings).length,
                    isChatEligibleMember:
                      window.chatSettings.isChatEligibleMember,
                    isChatAvailable: window.chatSettings.isChatAvailable,
                    numberOfPlans: window.chatSettings.numberOfPlans,
                    currentPlanName: window.chatSettings.currentPlanName,
                    LOB: window.chatSettings.LOB,
                    INQ_TYPE: window.chatSettings.INQ_TYPE,
                  },
                );
              }
            }
            logger.info(
              `${LOG_CONFIG_PREFIX} Chat store updated with new configuration.`,
            );
          } catch (error: any) {
            logger.error(
              `${LOG_CONFIG_PREFIX} Error during loadChatConfiguration:`,
              { message: error.message, stack: error.stack },
            );
            get().actions.setError(
              error instanceof Error ? error : new Error(String(error)),
            );
          } finally {
            logger.info(`${LOG_CONFIG_PREFIX} loadChatConfiguration finished.`);
            if (!get().config.error) {
              set((state) => ({
                config: { ...state.config, isLoading: false },
              }));
            }
          }
        },
      ),
      resetConfig: () => {
        logger.info(`${LOG_CONFIG_PREFIX} resetConfig called`);
        set((state) => ({
          config: {
            isLoading: false,
            error: null,
            genesysChatConfig: undefined,
            legacyConfig: undefined,
            cloudConfig: undefined,
            chatData: null,
            chatConfig: undefined,
            token: undefined,
          },
        }));
      },
      setChatActive: (isActive, sessionId) => {
        logger.info(`${LOG_SESSION_PREFIX} setChatActive called`, {
          isActive,
          sessionId,
        });
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: isActive,
            chatSessionId: sessionId || null,
          },
        }));
      },
      setChatInactive: () => {
        logger.info(`${LOG_SESSION_PREFIX} setChatInactive called`);
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: false,
            chatSessionId: null,
          },
        }));
      },
      updateLastActivity: () => {
        logger.info(`${LOG_SESSION_PREFIX} updateLastActivity called`);
        set((state) => ({
          session: {
            ...state.session,
            lastActivityTimestamp: Date.now(),
          },
        }));
      },
      setLoading: (loading) => {
        logger.info(`${LOG_CONFIG_PREFIX} setLoading called`, { loading });
        set((state) => ({ config: { ...state.config, isLoading: loading } }));
      },
      addMessage: (m: { content: string; sender: 'user' | 'agent' }) => {
        logger.info(`${LOG_SESSION_PREFIX} addMessage called`);
        set((state) => ({
          session: {
            ...state.session,
            messages: [
              ...state.session.messages,
              { ...m, id: Date.now().toString() },
            ],
          },
        }));
      },
      clearMessages: () => {
        logger.info(`${LOG_SESSION_PREFIX} clearMessages called`);
        set((state) => ({ session: { ...state.session, messages: [] } }));
      },
      setPlanSwitcherLocked: (locked, message) => {
        logger.info(`${LOG_SESSION_PREFIX} setPlanSwitcherLocked called`, {
          locked,
          message,
        });
        set((state) => ({
          session: {
            ...state.session,
            isPlanSwitcherLocked: locked,
            planSwitcherTooltipMessage:
              message || // Use provided message
              (locked
                ? 'End your chat session to switch plan information.' // Default lock message (ID: 31159)
                : ''), // Clear message when unlocked
          },
        }));
      },
      closeAndRedirect: () => {
        logger.info(
          `${LOG_SESSION_PREFIX} closeAndRedirect called. Setting chat inactive and clearing messages.`,
        );
        set((state) => ({
          ui: { ...state.ui, isOpen: false, isMinimized: false }, // Ensure minimized is also reset
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
          `${LOG_SESSION_PREFIX} startChat called. Setting chat active and locking plan switcher.`,
        );
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: true,
            isPlanSwitcherLocked: true,
          },
          // ui: { ...state.ui, isOpen: true, isMinimized: false } // Ensure chat window opens
        }));
      },
      endChat: () => {
        logger.info(
          `${LOG_SESSION_PREFIX} endChat called. Setting chat inactive and unlocking plan switcher.`,
        );
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: false,
            isPlanSwitcherLocked: false,
          },
          // ui: { ...state.ui, isOpen: false } // Ensure chat window UI state is also closed
        }));
      },
      setScriptLoadPhase: (phase: ScriptLoadPhase) => {
        logger.info(`${LOG_SCRIPT_PREFIX} setScriptLoadPhase called`, {
          phase,
        });
        set((state) => ({
          scripts: { ...state.scripts, scriptLoadPhase: phase },
        }));
      },
      openPlanSwitcherModal: () =>
        set((state) => ({
          ui: { ...state.ui, isPlanSwitcherModalOpen: true },
        })),
      closePlanSwitcherModal: () =>
        set((state) => ({
          ui: { ...state.ui, isPlanSwitcherModalOpen: false },
        })),
      openTnCModal: (lob: string) =>
        set((state) => ({
          ui: { ...state.ui, isTnCModalOpen: true, tnCModalLOB: lob },
        })),
      closeTnCModal: () =>
        set((state) => ({
          ui: { ...state.ui, isTnCModalOpen: false, tnCModalLOB: null },
        })),
      openPreChatModal: () =>
        set((state) => ({ ui: { ...state.ui, isPreChatModalOpen: true } })),
      closePreChatModal: () =>
        set((state) => ({ ui: { ...state.ui, isPreChatModalOpen: false } })),
    },
  };
});

logger.info(`${LOG_STORE_PREFIX} Chat store created.`);
