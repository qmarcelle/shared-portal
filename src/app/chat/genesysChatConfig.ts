/**
 * GenesysChatConfig DTO: All required fields for widgets.min.js and click_to_chat.js
 * Each field is annotated with its ideal source in a modern app.
 */
export interface GenesysChatConfig {
  /** API: Secure, per-user/session */
  clickToChatToken: string;
  /** API/env/config: Chat endpoint */
  clickToChatEndpoint: string;
  /** API/env/config: Demo endpoint (optional) */
  clickToChatDemoEndPoint?: string;
  /** API/static config: Co-browse license */
  coBrowseLicence: string;
  /** API/static config: Co-browse source */
  cobrowseSource: string;
  /** API/static config: Co-browse URL */
  cobrowseURL: string;
  /** API/static config: Ops phone number */
  opsPhone: string;
  /** API/static config: Ops phone hours */
  opsPhoneHours: string;
  /** API/eligibility logic: Routing chatbot eligible */
  routingchatbotEligible?: boolean | string;
  /** API/eligibility logic: Is chat eligible member */
  isChatEligibleMember: boolean | string;
  /** API/eligibility logic: Is demo member */
  isDemoMember?: boolean | string;
  /** API/eligibility logic: Is amplify member */
  isAmplifyMem?: boolean | string;
  /** API/eligibility logic: Is cobrowse active */
  isCobrowseActive?: boolean | string;
  /** API/eligibility logic: Is Magellan VA member */
  isMagellanVAMember?: boolean | string;
  /** Session/user context: User ID */
  userID: string;
  /** Session/user context: Member first name */
  memberFirstname?: string;
  /** Session/user context: Member last name */
  memberLastName?: string;
  /** Session/user context: Formatted first name */
  formattedFirstName?: string;
  /** Session/user context: Subscriber ID */
  subscriberID?: string;
  /** Session/user context: Suffix */
  sfx?: string;
  /** Plan/group context: Group ID */
  groupId?: string;
  chatGroup?: string;
  /** Plan/group context: Member client ID */
  memberClientID?: string;
  /** Plan/group context: Group type */
  groupType?: string;
  /** Plan/group context: Medical plan ID */
  memberMedicalPlanID?: string;
  /** Plan/group context: Member DOB */
  memberDOB?: string;
  /** API/eligibility logic: Is dental */
  isDental?: boolean | string;
  /** API/eligibility logic: Is medical */
  isMedical?: boolean | string;
  /** API/eligibility logic: Is vision */
  isVision?: boolean | string;
  /** API/eligibility logic: Is wellness only */
  isWellnessOnly?: boolean | string;
  /** API/eligibility logic: Is COBRA eligible */
  isCobraEligible?: boolean | string;
  /** API/eligibility logic: Is ID card eligible */
  isIDCardEligible?: boolean | string;
  /** API/eligibility logic: Is chat available */
  isChatAvailable: boolean | string;
  /** API/eligibility logic: Is chatbot eligible */
  chatbotEligible?: boolean | string;
  /** API/eligibility logic: Is medical advantage group */
  isMedicalAdvantageGroup?: boolean | string;
  /** API/static config: Chat working hours (e.g., 'S_S_24', 'M_F_8_17') */
  workingHours?: string;
  /** API/static config: Chat hours (display) */
  chatHours: string;
  /** API/static config: Raw chat hours (e.g. '8_17') */
  rawChatHrs: string;
  /** API/static config: Self-service links for after-hours */
  selfServiceLinks?: { key: string; value: string }[];
  /** API/static config: ID card bot name */
  idCardChatBotName: string;
  /** Static config/API: URL to widgets.min.js */
  widgetUrl: string;
  /** Static config/API: URL to click_to_chat.js */
  clickToChatJs: string;
  /** Static config/API: API endpoint for chat token */
  chatTokenEndpoint: string;
  /** Static config/API: API endpoint for co-browse */
  coBrowseEndpoint: string;
  /** Base chat endpoint for Genesys (used for dataURL/GMSChatURL) */
  gmsChatUrl: string;
  /** Chat mode: legacy or cloud */
  chatMode?: 'legacy' | 'cloud';
  /** Genesys Cloud deployment ID (cloud mode only) */
  deploymentId?: string;
  /** Genesys Cloud org ID (cloud mode only) */
  orgId?: string;
  /** Override for widgets.min.js script URL */
  genesysWidgetUrl?: string;
  /** BlueElite group flag */
  isBlueEliteGroup?: boolean | string;
  /** Inquiry type (for chat form) */
  INQ_TYPE?: string;
  /** Line of Business */
  LOB?: string;
  /** Member ID (composed) */
  MEMBER_ID?: string;
  /** Path to audio alert sound */
  audioAlertPath?: string;
  /** Timestamp for debugging and tracing */
  timestamp?: string;
  /** Data to pre-populate in the chat widget, typically user-specific. */
  userData?: Record<string, string>;

  /** Number of plans the user has */
  numberOfPlans?: number;
  /** Name of the current selected plan */
  currentPlanName?: string;
  /** ID of the HTML element where the chat widget will be injected */
  targetContainer: string;
  // ...any other custom fields from JSP mapping

  /** Additional fields for legacy mode */
  chatBtnText?: string;
  chatWidgetTitle?: string;
  chatWidgetSubtitle?: string;
  enableCobrowse?: boolean;
  showChatButton?: boolean;
}

// Define minimal types for user, plan, apiConfig
export interface UserConfig {
  userID: string;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string;
  subscriberID?: string;
  sfx?: string;
  memberDOB?: string;
}

export interface PlanConfig {
  memberMedicalPlanID: string;
  groupId?: string;
  memberClientID?: string;
  groupType?: string;
  memberDOB?: string;
}

interface ApiConfig {
  [key: string]: unknown;
}

import { MemberPlan } from '@/userManagement/models/plan';
import { logger } from '@/utils/logger';
import { ChatSettings } from './types/chat-types';

// Add this interface declaration after the existing interfaces
interface ZustandStores {
  planStore?: {
    getState: () => {
      plans: MemberPlan[];
      selectedPlanId: string;
    };
  };
}

// Extend Window interface to include __ZUSTAND_STORES__
declare global {
  interface Window {
    __ZUSTAND_STORES__?: ZustandStores;
  }
}

/**
 * Required fields for GenesysChatConfig
 * These fields MUST be present for the widget to function properly
 */
const REQUIRED_CONFIG_FIELDS = [
  'userID', // Always needed for user identity
  'isChatEligibleMember', // Needed for eligibility
  'targetContainer', // Needed for widget rendering
  // Removed non-critical fields that can have fallbacks
];

/**
 * Validate that a GenesysChatConfig has all required fields
 * @param config The config to validate
 * @returns An object with isValid flag and any missing fields
 */
function validateGenesysChatConfig(config: Partial<GenesysChatConfig>): {
  isValid: boolean;
  missingFields: string[];
} {
  // First check for absolutely critical fields
  const criticalMissingFields = REQUIRED_CONFIG_FIELDS.filter(
    (field) => !config[field as keyof GenesysChatConfig],
  );

  // Then check mode-specific required fields
  const modeSpecificMissingFields: string[] = [];
  if (config.chatMode === 'legacy' && !config.clickToChatEndpoint) {
    modeSpecificMissingFields.push(
      'clickToChatEndpoint (required for legacy mode)',
    );
  } else if (config.chatMode === 'cloud' && !config.deploymentId) {
    modeSpecificMissingFields.push('deploymentId (required for cloud mode)');
  }

  // Only treat truly critical fields as blocking
  return {
    isValid: criticalMissingFields.length === 0,
    missingFields: [...criticalMissingFields, ...modeSpecificMissingFields],
  };
}

/**
 * Build a GenesysChatConfig from user/session, plan/group, and API/static config sources.
 * @param user - user/session context (from auth/session)
 * @param plan - plan/group context (from plan store or API)
 * @param apiConfig - config/flags from API (eligibility, endpoints, etc)
 * @param staticConfig - static config (env, hardcoded, etc)
 */
export function buildGenesysChatConfig({
  user,
  plan,
  apiConfig,
  staticConfig = {},
}: {
  user: UserConfig;
  plan: PlanConfig;
  apiConfig: ApiConfig;
  staticConfig?: Partial<GenesysChatConfig>;
}): GenesysChatConfig {
  // Validate input parameters
  if (!user) {
    const error = new Error(
      'User context is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing user context', { error });
    throw error;
  }

  if (!user.userID) {
    const error = new Error('User ID is required in user context');
    logger.error('[buildGenesysChatConfig] Missing userID in user context', {
      error,
    });
    throw error;
  }

  if (!plan) {
    const error = new Error(
      'Plan context is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing plan context', { error });
    throw error;
  }

  if (!plan.memberMedicalPlanID) {
    const error = new Error(
      'Member Medical Plan ID is required in plan context',
    );
    logger.error(
      '[buildGenesysChatConfig] Missing memberMedicalPlanID in plan context',
      { error },
    );
    throw error;
  }

  // Determine chatMode
  const chatMode = apiConfig.cloudChatEligible ? 'cloud' : 'legacy';

  // Base config from API and context
  const config: Partial<GenesysChatConfig> = {
    // From User Context
    userID: user.userID,
    memberFirstname: user.memberFirstname,
    memberLastName: user.memberLastName,
    formattedFirstName: user.formattedFirstName || user.memberFirstname,
    subscriberID: user.subscriberID,
    sfx: user.sfx,
    MEMBER_ID: `${user.subscriberID || ''}-${user.sfx || ''}`,
    memberDOB: user.memberDOB || plan.memberDOB,

    // From Plan Context
    memberMedicalPlanID: plan.memberMedicalPlanID,
    groupId: plan.groupId,
    memberClientID: plan.memberClientID, // LOB can be derived from this or groupType
    groupType: plan.groupType,

    // From API Config (getChatInfo response)
    clickToChatToken: apiConfig.clickToChatToken as string,
    isChatEligibleMember:
      (apiConfig.isChatEligibleMember as string | boolean | undefined) ??
      (apiConfig.isEligible as string | boolean | undefined) ??
      true,
    isChatAvailable:
      (apiConfig.isChatAvailable as string | boolean | undefined) ??
      (apiConfig.chatAvailable as string | boolean | undefined) ??
      true,
    chatGroup: apiConfig.chatGroup as string,
    workingHours: apiConfig.workingHours as string,
    chatHours: (apiConfig.workingHours ||
      process.env.NEXT_PUBLIC_CHAT_HOURS ||
      'M-F 8am-5pm') as string,
    rawChatHrs: (apiConfig.rawChatHrs ||
      process.env.NEXT_PUBLIC_RAW_CHAT_HRS ||
      '8_17') as string,
    idCardChatBotName: apiConfig.chatIDChatBotName as string, // Assuming chatIDChatBotName is idCardChatBotName
    chatbotEligible: apiConfig.chatBotEligibility as boolean,
    routingchatbotEligible: apiConfig.routingChatBotEligibility as boolean,

    // Chat Mode specific
    chatMode: chatMode,
  };

  // Populate mode-specific fields
  if (chatMode === 'cloud') {
    config.deploymentId =
      (apiConfig.genesysCloudConfig as any)?.deploymentId ||
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID;
    config.orgId =
      (apiConfig.genesysCloudConfig as any)?.orgId ||
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID;
    // For cloud, gmsChatUrl might not be used in the same way, or could be the API endpoint base
  } else {
    // Legacy mode
    config.clickToChatEndpoint =
      (apiConfig.clickToChatEndpoint as string) ||
      process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT;
    config.gmsChatUrl =
      (apiConfig.gmsChatUrl as string) ||
      process.env.NEXT_PUBLIC_GMS_CHAT_URL ||
      config.clickToChatEndpoint; // Default gmsChatUrl to clickToChatEndpoint for legacy
  }

  // Populate from environment variables / static defaults
  config.widgetUrl =
    process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL ||
    'https://apps.mypurecloud.com/widgets/9.0/widgets.min.js';
  config.clickToChatJs =
    process.env.NEXT_PUBLIC_CLICK_TO_CHAT_JS_URL ||
    '/assets/genesys/click_to_chat.js';

  // If gmsChatUrl is not set by legacy mode logic, and it's cloud, it might need a different source or not be needed by click_to_chat.js for cloud mode.
  // For now, ensure it has a fallback if not set. click_to_chat.js uses gmsServicesConfig.GMSChatURL which uses clickToChatEndpoint in legacy.
  if (!config.gmsChatUrl && chatMode === 'legacy') {
    config.gmsChatUrl = config.clickToChatEndpoint;
  } else if (!config.gmsChatUrl && chatMode === 'cloud') {
    // For cloud, this might be different or derived. For now, a placeholder if needed
  }

  // Add more default values that might be required for button creation
  if (chatMode === 'legacy') {
    // These values are often required for legacy chat button initialization
    config.chatBtnText =
      config.chatBtnText ||
      (config.isAmplifyMem ? 'Chat with an advisor' : 'Chat Now');
    config.chatWidgetTitle = config.chatWidgetTitle || 'Customer Service Chat';
    config.chatWidgetSubtitle =
      config.chatWidgetSubtitle || "We're here to help.";
    config.enableCobrowse = config.enableCobrowse || false;
    config.showChatButton = true; // Explicitly request button
  }

  // Ensure the targetContainer is explicitly set for the widget to render
  config.targetContainer = 'genesys-chat-container';

  // Other static/defaultable fields from the original JSP mapping, if needed
  config.coBrowseLicence =
    process.env.NEXT_PUBLIC_COBROWSE_LICENCE || 'YOUR_COBROWSE_LICENCE';
  config.cobrowseSource =
    process.env.NEXT_PUBLIC_COBROWSE_SOURCE || 'YOUR_COBROWSE_SOURCE';
  config.cobrowseURL =
    process.env.NEXT_PUBLIC_COBROWSE_URL || 'YOUR_COBROWSE_URL';
  config.opsPhone = process.env.NEXT_PUBLIC_OPS_PHONE || '1-800-MEMBER-LINE';
  config.opsPhoneHours =
    process.env.NEXT_PUBLIC_OPS_PHONE_HOURS || 'M-F 8am-6pm EST';
  config.isDemoMember = process.env.NEXT_PUBLIC_IS_DEMO_MEMBER === 'true';
  config.isAmplifyMem = !!apiConfig.isAmplifyMem; // Coerce to boolean
  config.isCobrowseActive =
    process.env.NEXT_PUBLIC_IS_COBROWSE_ACTIVE === 'true';

  // Ensure critical fields have fallbacks
  if (!config.clickToChatToken) {
    // This is a token for authentication, so we should log the issue
    logger.warn(
      '[buildGenesysChatConfig] Missing clickToChatToken, using fallback',
    );
    config.clickToChatToken =
      process.env.NEXT_PUBLIC_DEFAULT_CLICK_TO_CHAT_TOKEN || 'fallback-token';
  }

  // Add any missing fields for critical elements
  if (chatMode === 'legacy' && !config.clickToChatEndpoint) {
    logger.warn(
      '[buildGenesysChatConfig] Missing clickToChatEndpoint for legacy mode, using fallback',
    );
    config.clickToChatEndpoint =
      process.env.NEXT_PUBLIC_GENESYS_LEGACY_ENDPOINT ||
      'https://legacy-chat-endpoint.example.com';
  } else if (chatMode === 'cloud' && !config.deploymentId) {
    logger.warn(
      '[buildGenesysChatConfig] Missing deploymentId for cloud mode, using fallback',
    );
    config.deploymentId =
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
      'fallback-deployment-id';
  }

  // Default chatTokenEndpoint and coBrowseEndpoint if needed
  config.chatTokenEndpoint = config.chatTokenEndpoint || '/api/chat/token';
  config.coBrowseEndpoint = config.coBrowseEndpoint || '/api/cobrowse';

  // Merge with any staticConfig overrides passed in
  const mergedConfig = { ...config, ...staticConfig } as GenesysChatConfig;

  // Final validation
  const validation = validateGenesysChatConfig(mergedConfig);
  if (!validation.isValid) {
    logger.warn(
      '[buildGenesysChatConfig] Built config is missing required fields:',
      {
        missingFields: validation.missingFields,
        generatedConfig: mergedConfig,
      },
    );
    // Depending on strictness, you might throw an error here or allow it to proceed
    // For now, we'll log a warning. Some fields in REQUIRED_CONFIG_FIELDS might be for legacy only.
  }

  logger.info('[buildGenesysChatConfig] Successfully built GenesysChatConfig', {
    chatMode: mergedConfig.chatMode,
    userID: mergedConfig.userID,
    planId: mergedConfig.memberMedicalPlanID,
    isEligible: mergedConfig.isChatEligibleMember,
  });

  return mergedConfig;
}

/**
 * (Optional) React hook to fetch GenesysChatConfig from an API and inject into window.chatSettings
 */
import { useEffect } from 'react';
export function useGenesysChatConfig(
  fetchConfig: () => Promise<GenesysChatConfig>,
) {
  useEffect(() => {
    fetchConfig().then((config) => {
      if (typeof window !== 'undefined') {
        window.chatSettings = config as ChatSettings;
      }
    });
  }, [fetchConfig]);
}
