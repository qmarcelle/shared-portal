/**
 * @file chatStore.ts
 * @description Centralized Zustand store for managing all Genesys cloud chat-related state and actions.
 * Simplified from legacy/cloud to cloud-only implementation.
 */
import { create } from 'zustand';

import type { LoggedInMember } from '@/models/app/loggedin_member';
import type { UserProfile } from '@/models/user_profile';
import type { SessionUser } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';

import { getChatInfo } from '../api';
import {
  buildGenesysChatConfig,
  GenesysChatConfig,
} from '../config/genesysChatConfig';
import { ChatConfig, ChatConfigSchema } from '../schemas/genesys.schema';
import { CloudChatConfig, ScriptLoadPhase } from '../types/chat-types';
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
    genesysChatConfig?: GenesysChatConfig; // Cloud-only configuration
    cloudConfig?: {
      // Derived from genesysChatConfig for cloud mode
      environment: string;
      deploymentId: string;
      customAttributes?: Record<string, string | undefined>;
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
}

// This function is a pass-through in its current implementation.
// It's preserved in case it's intended for future memoization or specific type inference stability.
function makeStable<T>(fn: T): T {
  return fn;
}

export const chatUISelectors = {
  /* ... (no changes needed here based on prompt) ... */
};
export const chatConfigSelectors = {
  isLoading: (state: ChatState) => state.config.isLoading,
  error: (state: ChatState) => state.config.error,
  genesysChatConfig: (state: ChatState) => state.config.genesysChatConfig,
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
   * @param buildOutput The fully processed GenesysChatConfig (cloud-only).
   * @param validatedConfig The Zod-validated raw API response.
   * @param rawChatConfig The raw response from the getChatInfo API.
   */
  const _updateStoreWithChatConfiguration = (
    buildOutput: GenesysChatConfig,
    validatedConfig: ChatConfig,
    rawChatConfig: unknown, // Should match the type of getChatInfo response
  ) => {
    // Cloud-only configuration processing
    const cloudConfig = {
      environment:
        (buildOutput as unknown as CloudChatConfig).environment || '',
      deploymentId:
        (buildOutput as unknown as CloudChatConfig).deploymentId || '',
      customAttributes: {
        Firstname:
          buildOutput.formattedFirstName || buildOutput.memberFirstname,
        lastname: buildOutput.memberLastName,
        MEMBER_ID: buildOutput.MEMBER_ID,
        MEMBER_DOB: buildOutput.memberDOB,
        GROUP_ID: buildOutput.groupId,
        PLAN_ID: buildOutput.memberMedicalPlanID,
        INQ_TYPE: buildOutput.INQ_TYPE,
        LOB: buildOutput.LOB,
        lob_group: (buildOutput as unknown as Record<string, unknown>)
          .lob_group as string,
        SERV_Type: (buildOutput as unknown as Record<string, unknown>)
          .SERV_Type as string,
        RoutingChatbotInteractionId: (
          buildOutput as unknown as Record<string, unknown>
        ).RoutingChatbotInteractionId as string,
        IDCardBotName: buildOutput.idCardChatBotName,
        IsVisionEligible: String(buildOutput.isVision),
        coverage_eligibility: (
          buildOutput as unknown as Record<string, unknown>
        ).coverage_eligibility as string,
        IsDentalEligible: String(buildOutput.isDental),
        IsMedicalEligible: String(buildOutput.isMedical),
        Origin: (buildOutput as unknown as Record<string, unknown>)
          .Origin as string,
        'Source of chat': (buildOutput as unknown as Record<string, unknown>)[
          'Source of chat'
        ] as string,
      },
    };

    set((state) => ({
      config: {
        ...state.config,
        genesysChatConfig: buildOutput,
        cloudConfig,
        isLoading: false,
        error: null,
        chatData: {
          isEligible: buildOutput.isChatEligibleMember as boolean,
          cloudChatEligible: true, // Always true in cloud-only architecture
          chatAvailable: buildOutput.isChatAvailable === 'true',
          chatGroup: buildOutput.chatGroup,
          workingHours: buildOutput.workingHours,
          rawChatHrs: buildOutput.rawChatHrs,
          genesysCloudConfig: {
            deploymentId:
              (buildOutput as unknown as CloudChatConfig).deploymentId || '',
            environment:
              (buildOutput as unknown as CloudChatConfig).environment || '',
            orgId: (buildOutput as unknown as CloudChatConfig).orgId || '',
          },
          routingInteractionId: (rawChatConfig as Record<string, unknown>)
            ?.routingInteractionId as string,
        },
        chatConfig: validatedConfig,
        token: undefined, // No legacy token needed for cloud
      },
    }));
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
        logger.error('[ChatStore:Config] setError called', {
          newError: err,
          prevError: get().config.error,
        });
        set((state) => ({
          config: {
            ...state.config,
            error: err,
            isLoading: false, // Ensure loading is stopped on error
            // Clear config fields on critical error
            genesysChatConfig: err ? undefined : state.config.genesysChatConfig,
            cloudConfig: err ? undefined : state.config.cloudConfig,
            chatData: err ? null : state.config.chatData,
          },
        }));
      }),
      loadChatConfiguration: async (
        apiCallMemberId: string,
        loggedInMember: LoggedInMember,
        sessionUser: SessionUser,
        userProfile: UserProfile,
        currentPlanDetails: CurrentPlanDetails,
      ) => {
        // **CLOUD FLOW STEP 5** - ChatStore begins configuration loading process
        logger.info(
          `[ChatStore:Config] [CLOUD FLOW] Starting configuration loading for member ${apiCallMemberId}. This orchestrates: getChatInfo API → buildGenesysChatConfig → updateStore.`,
          {
            memberId: apiCallMemberId,
            memberName: `${loggedInMember.firstName} ${loggedInMember.lastName}`,
            planCount: currentPlanDetails.numberOfPlans,
            currentPlan: currentPlanDetails.currentPlanName,
          },
        );

        set((state) => ({
          config: { ...state.config, isLoading: true, error: null },
        }));

        try {
          // **CLOUD FLOW STEP 6** - Call Member Service API for chat configuration
          logger.info(
            `[ChatStore:Config] [CLOUD FLOW] Calling getChatInfo API with memberId: ${apiCallMemberId}. This will determine chat eligibility and cloud configuration.`,
          );

          const rawChatConfig = await getChatInfo(apiCallMemberId);

          logger.info(
            '[ChatStore:Config] [CLOUD FLOW] getChatInfo API response received. Validating against schema.',
            {
              hasCloudConfig: !!(rawChatConfig as Record<string, unknown>)
                ?.genesysCloudConfig,
              isChatEligible: (rawChatConfig as Record<string, unknown>)
                ?.isChatEligibleMember,
              chatAvailable: (rawChatConfig as Record<string, unknown>)
                ?.chatAvailable,
            },
          );

          // **CLOUD FLOW STEP 7** - Validate API response structure
          const parsedChatInfo = ChatConfigSchema.safeParse(rawChatConfig);
          if (!parsedChatInfo.success) {
            logger.error(
              '[ChatStore:Config] [CLOUD FLOW] API response validation failed. Invalid schema structure.',
              {
                errors: parsedChatInfo.error.errors,
                flattenedErrors: parsedChatInfo.error.flatten(),
                rawData: rawChatConfig,
              },
            );
            throw new Error(
              'Chat configuration validation failed against schema.',
            );
          }
          const validatedConfig = parsedChatInfo.data;

          // **CLOUD FLOW STEP 8** - Build cloud-only configuration from all data sources
          logger.info(
            '[ChatStore:Config] [CLOUD FLOW] API response validated. Building cloud-only configuration using buildGenesysChatConfig().',
          );

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

          logger.info(
            '[ChatStore:Config] [CLOUD FLOW] Cloud configuration built successfully. Updating chat store state.',
            {
              chatMode: buildOutput.chatMode,
              isEligible: buildOutput.isChatEligibleMember,
              deploymentId: buildOutput.deploymentId,
              environment: buildOutput.environment,
            },
          );

          // **CLOUD FLOW STEP 9** - Update global API state and store
          updateApiState(
            buildOutput.isChatEligibleMember as boolean,
            'cloud', // Always cloud in cloud-only architecture
          );

          _updateStoreWithChatConfiguration(
            buildOutput,
            validatedConfig,
            rawChatConfig,
          );

          // **FLOW CONTINUES** - Next: ChatWidget will use this config to load GenesysCloudLoader
          logger.info(
            '[ChatStore:Config] [CLOUD FLOW] Configuration loading complete. Flow continues: ChatWidget → GenesysCloudLoader → Script Loading.',
          );
        } catch (error: unknown) {
          logger.error(
            '[ChatStore:Config] [CLOUD FLOW] Configuration loading failed. Chat system will be unavailable.',
            error,
          );
          set((state) => ({
            config: {
              ...state.config,
              isLoading: false,
              error: error instanceof Error ? error : new Error(String(error)),
              genesysChatConfig: undefined,
              cloudConfig: undefined,
              chatData: null,
            },
          }));
          updateApiState(false, null);
          throw error; // Re-throw to allow ChatProvider to catch it
        }
      },
      resetConfig: () => {
        set(() => ({
          config: {
            isLoading: false,
            error: null,
            genesysChatConfig: undefined,
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
              message ||
              (locked
                ? 'End your chat session to switch plan information.'
                : ''),
          },
        }));
      },
      closeAndRedirect: () => {
        set((state) => ({
          ui: { ...state.ui, isOpen: false, isMinimized: false },
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
