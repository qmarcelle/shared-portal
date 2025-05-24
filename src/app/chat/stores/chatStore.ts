/**
 * @file chatStore.ts
 * @description Centralized Zustand store for managing all Genesys chat-related state and actions.
 */
import { create } from 'zustand';

import type { LoggedInMember } from '@/models/app/loggedin_member'; // Import the rich models
import type { UserProfile } from '@/models/user_profile';
import type { SessionUser } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger'; // Centralized logger

import { getChatInfo } from '../api';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
} from '../config/genesysChatConfig';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import {
  ChatSettings,
  CloudChatConfig,
  isLegacyChatConfig,
  ScriptLoadPhase,
} from '../types/chat-types'; // ChatSettings is LegacyChatConfig, import CloudChatConfig here
import { updateApiState } from '../utils/chatSequentialLoader';

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
      // apiCallPlanId: string, // Specific Plan ID for the API call - REMOVED

      // Full data models now passed directly
      loggedInMember: LoggedInMember,
      sessionUser: SessionUser,
      userProfile: UserProfile,
      currentPlanDetails: CurrentPlanDetails,
      apiConfig?: ChatConfig,
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

// This function is a pass-through in its current implementation.
// It's preserved in case it's intended for future memoization or specific type inference stability.
function makeStable<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
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
  /**
   * Helper function to update the store's config state after successfully
   * fetching, validating, and building the chat configuration.
   * @param buildOutput The fully processed GenesysChatConfig.
   * @param validatedConfig The Zod-validated raw API response.
   * @param rawChatConfig The raw response from the getChatInfo API.
   */
  const _updateStoreWithChatConfiguration = (
    buildOutput: GenesysChatConfig,
    validatedConfig: ChatConfig,
    rawChatConfig: any, // Should match the type of getChatInfo response
  ) => {
    set((state) => ({
      config: {
        ...state.config,
        genesysChatConfig: buildOutput,
        legacyConfig:
          buildOutput.chatMode === 'legacy'
            ? (buildOutput as unknown as ChatSettings)
            : undefined,
        cloudConfig:
          buildOutput.chatMode === 'cloud'
            ? {
                environment:
                  (buildOutput as unknown as CloudChatConfig).environment || '',
                deploymentId:
                  (buildOutput as unknown as CloudChatConfig).deploymentId ||
                  '',
                customAttributes: {
                  Firstname:
                    buildOutput.formattedFirstName ||
                    buildOutput.memberFirstname,
                  lastname: buildOutput.memberLastName,
                  MEMBER_ID: buildOutput.MEMBER_ID,
                  MEMBER_DOB: buildOutput.memberDOB,
                  GROUP_ID: buildOutput.groupId,
                  PLAN_ID: buildOutput.memberMedicalPlanID,
                  INQ_TYPE: buildOutput.INQ_TYPE,
                  LOB: buildOutput.LOB,
                  lob_group: (buildOutput as any).lob_group,
                  SERV_Type: (buildOutput as any).SERV_Type,
                  RoutingChatbotInteractionId: (buildOutput as any)
                    .RoutingChatbotInteractionId,
                  IDCardBotName: buildOutput.idCardChatBotName,
                  IsVisionEligible: String(buildOutput.isVision),
                  coverage_eligibility: (buildOutput as any)
                    .coverage_eligibility,
                  IsDentalEligible: String(buildOutput.isDental),
                  IsMedicalEligible: String(buildOutput.isMedical),
                  Origin: (buildOutput as any).Origin,
                  'Source of chat': (buildOutput as any)['Source of chat'],
                },
              }
            : undefined,
        isLoading: false,
        error: null,
        chatData: {
          isEligible: buildOutput.isChatEligibleMember as boolean,
          cloudChatEligible: buildOutput.chatMode === 'cloud',
          chatAvailable: buildOutput.isChatAvailable === 'true',
          chatGroup: buildOutput.chatGroup,
          workingHours: buildOutput.workingHours,
          rawChatHrs: buildOutput.rawChatHrs,
          genesysCloudConfig:
            buildOutput.chatMode === 'cloud'
              ? {
                  deploymentId:
                    (buildOutput as unknown as CloudChatConfig).deploymentId ||
                    '',
                  environment:
                    (buildOutput as unknown as CloudChatConfig).environment ||
                    '',
                  orgId:
                    (buildOutput as unknown as CloudChatConfig).orgId || '',
                }
              : undefined,
          routingInteractionId: (rawChatConfig as any)?.routingInteractionId,
        },
        chatConfig: validatedConfig,
        token: isLegacyChatConfig(buildOutput)
          ? buildOutput.clickToChatToken
          : undefined,
      },
    }));

    if (typeof window !== 'undefined') {
      window.chatSettings = buildOutput as any;
      // Removed logger.info for window.chatSettings population
    }
  };

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
        set((state) => ({ ui: { ...state.ui, isOpen } }));
      }),
      setMinimized: (min) => {
        set((state) => ({ ui: { ...state.ui, isMinimized: min } }));
      },
      minimizeChat: () => {
        set((state) => ({ ui: { ...state.ui, isMinimized: true } }));
      },
      maximizeChat: () => {
        set((state) => ({ ui: { ...state.ui, isMinimized: false } }));
      },
      incrementMessageCount: () => {
        set((state) => ({
          ui: { ...state.ui, newMessageCount: state.ui.newMessageCount + 1 },
        }));
      },
      resetMessageCount: () => {
        set((state) => ({ ui: { ...state.ui, newMessageCount: 0 } }));
      },
      setButtonState: makeStable(
        (buttonState: 'not-attempted' | 'creating' | 'created' | 'failed') => {
          set((state) => ({ ui: { ...state.ui, buttonState } }));
        },
      ),
      setError: makeStable((err: Error | null) => {
        logger.error(`[ChatStore:Config] setError called`, {
          newError: err,
          prevError: get().config.error,
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
            // chatConfig is intentionally not reset here to match original setError behavior
          },
        })); // Ensure isLoading is false on error
      }),
      loadChatConfiguration: makeStable(
        async (
          apiCallMemberId: string,
          loggedInMember: LoggedInMember,
          sessionUser: SessionUser,
          userProfile: UserProfile,
          currentPlanDetails: CurrentPlanDetails,
          // apiConfig?: ChatConfig, // Parameter preserved in signature though unused in refactored body
        ) => {
          set((state) => ({
            config: { ...state.config, isLoading: true, error: null },
          }));

          try {
            const rawChatConfig = await getChatInfo(apiCallMemberId);

            const parsedChatInfo = ChatConfigSchema.safeParse(rawChatConfig);
            if (!parsedChatInfo.success) {
              logger.error(
                `[ChatStore:Config] Failed to validate API response against ChatConfigSchema.`,
                {
                  errors: parsedChatInfo.error.errors, // Original errors array
                  flattenedErrors: parsedChatInfo.error.flatten(),
                  rawData: rawChatConfig,
                },
              );
              throw new Error(
                'Chat configuration validation failed against schema.',
              );
            }
            const validatedConfig = parsedChatInfo.data;

            type BuildChatConfigArg = {
              loggedInMember: LoggedInMember;
              sessionUser: SessionUser;
              userProfile: UserProfile;
              apiConfig: ChatConfig;
              currentPlanDetails: CurrentPlanDetails;
              staticConfig?: Partial<GenesysChatConfig>;
            };

            const buildOutput = buildGenesysChatConfig({
              loggedInMember,
              sessionUser,
              userProfile,
              apiConfig: validatedConfig,
              currentPlanDetails,
            } as BuildChatConfigArg);

            updateApiState(
              buildOutput.isChatEligibleMember as boolean,
              buildOutput.chatMode === 'cloud' ? 'cloud' : 'legacy',
            );

            _updateStoreWithChatConfiguration(
              buildOutput,
              validatedConfig,
              rawChatConfig,
            );
          } catch (error: any) {
            logger.error(
              `[ChatStore:Config] Error in loadChatConfiguration:`,
              error,
            );
            set((state) => ({
              config: {
                ...state.config,
                isLoading: false,
                error,
                genesysChatConfig: undefined,
                legacyConfig: undefined,
                cloudConfig: undefined,
                chatData: null,
                // chatConfig is intentionally not reset here to match original catch block behavior
              },
            }));
            updateApiState(false, null);
            throw error; // Re-throw to allow ChatProvider to catch it
          }
        },
      ),
      resetConfig: () => {
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
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: isActive,
            chatSessionId: sessionId || null,
          },
        }));
      },
      setChatInactive: () => {
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: false,
            chatSessionId: null,
          },
        }));
      },
      updateLastActivity: () => {
        set((state) => ({
          session: {
            ...state.session,
            lastActivityTimestamp: Date.now(),
          },
        }));
      },
      setLoading: (loading) => {
        set((state) => ({ config: { ...state.config, isLoading: loading } }));
      },
      addMessage: (m: { content: string; sender: 'user' | 'agent' }) => {
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
        set((state) => ({ session: { ...state.session, messages: [] } }));
      },
      setPlanSwitcherLocked: (locked, message) => {
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
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: true,
            isPlanSwitcherLocked: true,
          },
        }));
      },
      endChat: () => {
        set((state) => ({
          session: {
            ...state.session,
            isChatActive: false,
            isPlanSwitcherLocked: false,
          },
        }));
      },
      setScriptLoadPhase: (phase: ScriptLoadPhase) => {
        // Original logger.info removed as per logging cleanup rules for non-critical logs.
        // No new logger.warn added as per rule to preserve existing warns, not create new ones from info logs.
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
      openPreChatModal: () => {
        console.log(
          '[ChatStore] openPreChatModal ACTION called. Setting isPreChatModalOpen to true.',
        );
        set((state) => ({ ui: { ...state.ui, isPreChatModalOpen: true } }));
      },
      closePreChatModal: () =>
        set((state) => ({ ui: { ...state.ui, isPreChatModalOpen: false } })),
    },
  };
});
