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
  // ...any other custom fields from JSP mapping
}

// Define minimal types for user, plan, apiConfig
interface UserConfig {
  userID: string;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string;
  subscriberID?: string;
  sfx?: string;
}
interface PlanConfig {
  memberMedicalPlanID: string;
  groupId?: string;
  memberClientID?: string;
  groupType?: string;
  memberDOB?: string;
}
interface ApiConfig {
  [key: string]: unknown;
}

import { logger } from '@/utils/logger';

/**
 * Required fields for GenesysChatConfig
 * These fields MUST be present for the widget to function properly
 */
const REQUIRED_CONFIG_FIELDS = [
  'clickToChatToken',
  'clickToChatEndpoint',
  'coBrowseLicence',
  'cobrowseSource',
  'cobrowseURL',
  'userID',
  'memberMedicalPlanID',
  'isChatEligibleMember',
  'isChatAvailable',
  'chatHours',
  'rawChatHrs',
  'widgetUrl',
  'clickToChatJs',
  'gmsChatUrl',
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
  const missingFields = REQUIRED_CONFIG_FIELDS.filter(
    (field) => !config[field as keyof GenesysChatConfig],
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
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
      'Member medical plan ID is required in plan context',
    );
    logger.error(
      '[buildGenesysChatConfig] Missing memberMedicalPlanID in plan context',
      { error },
    );
    throw error;
  }

  if (!apiConfig) {
    const error = new Error('API config is required for building chat config');
    logger.error('[buildGenesysChatConfig] Missing API config', { error });
    throw error;
  }

  logger.info(
    '[buildGenesysChatConfig] Building chat config with validated inputs',
    {
      hasUser: !!user,
      hasPlan: !!plan,
      hasApiConfig: !!apiConfig,
      userID: user.userID,
      planID: plan.memberMedicalPlanID,
      apiConfigKeys: Object.keys(apiConfig),
      staticConfigKeys: Object.keys(staticConfig || {}),
      timestamp: new Date().toISOString(),
    },
  );

  // Build the configuration with all available data
  const config: GenesysChatConfig = {
    clickToChatToken: apiConfig.clickToChatToken as string,
    clickToChatEndpoint: apiConfig.clickToChatEndpoint as string,
    clickToChatDemoEndPoint: apiConfig.clickToChatDemoEndPoint as
      | string
      | undefined,
    coBrowseLicence: staticConfig.coBrowseLicence!,
    cobrowseSource: staticConfig.cobrowseSource!,
    cobrowseURL: staticConfig.cobrowseURL!,
    opsPhone: staticConfig.opsPhone!,
    opsPhoneHours: staticConfig.opsPhoneHours!,
    routingchatbotEligible: apiConfig.routingchatbotEligible as
      | boolean
      | string
      | undefined,
    isChatEligibleMember: apiConfig.isChatEligibleMember as boolean | string,
    isDemoMember: apiConfig.isDemoMember as boolean | string | undefined,
    isAmplifyMem: apiConfig.isAmplifyMem as boolean | string | undefined,
    isCobrowseActive: apiConfig.isCobrowseActive as
      | boolean
      | string
      | undefined,
    isMagellanVAMember: apiConfig.isMagellanVAMember as
      | boolean
      | string
      | undefined,
    userID: user.userID,
    memberFirstname: user.memberFirstname,
    memberLastName: user.memberLastName,
    formattedFirstName: user.formattedFirstName,
    subscriberID: user.subscriberID,
    sfx: user.sfx,
    groupId: plan.groupId,
    memberClientID: plan.memberClientID,
    groupType: plan.groupType,
    memberMedicalPlanID: plan.memberMedicalPlanID,
    memberDOB: plan.memberDOB,
    isDental: apiConfig.isDental as boolean | string | undefined,
    isMedical: apiConfig.isMedical as boolean | string | undefined,
    isVision: apiConfig.isVision as boolean | string | undefined,
    isWellnessOnly: apiConfig.isWellnessOnly as boolean | string | undefined,
    isCobraEligible: apiConfig.isCobraEligible as boolean | string | undefined,
    isIDCardEligible: apiConfig.isIDCardEligible as
      | boolean
      | string
      | undefined,
    isChatAvailable: apiConfig.isChatAvailable as boolean | string,
    chatbotEligible: apiConfig.chatbotEligible as boolean | string | undefined,
    isMedicalAdvantageGroup: apiConfig.isMedicalAdvantageGroup as
      | boolean
      | string
      | undefined,
    chatHours: staticConfig.chatHours!,
    rawChatHrs: staticConfig.rawChatHrs!,
    selfServiceLinks: staticConfig.selfServiceLinks,
    idCardChatBotName: staticConfig.idCardChatBotName!,
    widgetUrl: staticConfig.widgetUrl!,
    clickToChatJs: staticConfig.clickToChatJs!,
    chatTokenEndpoint: staticConfig.chatTokenEndpoint!,
    coBrowseEndpoint: staticConfig.coBrowseEndpoint!,
    gmsChatUrl: staticConfig.gmsChatUrl!,
    chatMode: staticConfig.chatMode,
    deploymentId: staticConfig.deploymentId,
    orgId: staticConfig.orgId,
    genesysWidgetUrl: staticConfig.genesysWidgetUrl,
    isBlueEliteGroup: staticConfig.isBlueEliteGroup,
    INQ_TYPE: staticConfig.INQ_TYPE,
    LOB: staticConfig.LOB,
    MEMBER_ID: staticConfig.MEMBER_ID,
    audioAlertPath: staticConfig.audioAlertPath,
    // ...add any other custom fields as needed
  };

  // Validate that all required fields are present
  const validation = validateGenesysChatConfig(config);

  if (!validation.isValid) {
    logger.warn('[buildGenesysChatConfig] Config missing required fields', {
      missingFields: validation.missingFields,
      timestamp: new Date().toISOString(),
    });

    // Apply fallbacks for critical fields where possible
    if (!config.clickToChatJs && typeof window !== 'undefined') {
      config.clickToChatJs = '/assets/genesys/click_to_chat.js';
      logger.info(
        '[buildGenesysChatConfig] Applied fallback for clickToChatJs',
      );
    }

    if (!config.widgetUrl && typeof window !== 'undefined') {
      config.widgetUrl = '/assets/genesys/plugins/widgets.min.css';
      logger.info('[buildGenesysChatConfig] Applied fallback for widgetUrl');
    }

    if (!config.chatMode) {
      // Default to legacy mode if not specified and cloud flags not set
      config.chatMode = 'legacy';
      logger.info('[buildGenesysChatConfig] Applied fallback chatMode: legacy');
    }
  }

  // Log the final configuration for tracing
  logger.info('[buildGenesysChatConfig] Returning final config', {
    configKeys: Object.keys(config),
    userID: config.userID,
    memberMedicalPlanID: config.memberMedicalPlanID,
    chatMode: config.chatMode,
    isChatEligible: config.isChatEligibleMember,
    isChatAvailable: config.isChatAvailable,
    hasToken: !!config.clickToChatToken,
    timestamp: new Date().toISOString(),
  });

  return config;
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
        window.chatSettings = config;
      }
    });
  }, [fetchConfig]);
}
