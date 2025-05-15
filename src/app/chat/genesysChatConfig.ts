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
  /** Timestamp for debugging and tracing */
  timestamp?: string;
  // ...any other custom fields from JSP mapping
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

import { logger } from '@/utils/logger';
import { CHAT_ENDPOINTS, getChatConfig } from './config/endpoints';
import { ChatSettings } from './types/chat-types';

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

  const env: NodeJS.ProcessEnv =
    typeof process !== 'undefined' ? process.env : ({} as NodeJS.ProcessEnv);
  const endpoints = getChatConfig();

  // --- Explicit sensible defaults for all required fields ---
  const defaults: Partial<GenesysChatConfig> = {
    clickToChatToken:
      (apiConfig.clickToChatToken as string) ||
      (apiConfig.token as string) ||
      env.NEXT_PUBLIC_DEFAULT_CHAT_TOKEN ||
      '',
    clickToChatEndpoint:
      (apiConfig.clickToChatEndpoint as string) ||
      endpoints.CLICK_TO_CHAT_ENDPOINT ||
      env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT ||
      'https://api3.bcbst.com/stge/soa/api/cci/genesyschat',
    gmsChatUrl:
      staticConfig.gmsChatUrl ||
      env.NEXT_PUBLIC_GMS_CHAT_URL ||
      endpoints.CLICK_TO_CHAT_ENDPOINT ||
      'https://api3.bcbst.com/stge/soa/api/cci/genesyschat',
    widgetUrl:
      staticConfig.widgetUrl ||
      env.NEXT_PUBLIC_GENESYS_WIDGET_URL ||
      CHAT_ENDPOINTS.WIDGETS_CSS_URL ||
      '/assets/genesys/plugins/widgets.min.css',
    clickToChatJs:
      staticConfig.clickToChatJs ||
      env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS ||
      CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL ||
      '/assets/genesys/click_to_chat.js',
    coBrowseLicence:
      staticConfig.coBrowseLicence || env.NEXT_PUBLIC_COBROWSE_LICENSE || '',
    cobrowseSource:
      staticConfig.cobrowseSource || env.NEXT_PUBLIC_COBROWSE_SOURCE || '',
    cobrowseURL: staticConfig.cobrowseURL || env.NEXT_PUBLIC_COBROWSE_URL || '',
    opsPhone: staticConfig.opsPhone || env.NEXT_PUBLIC_OPS_PHONE || '',
    opsPhoneHours:
      staticConfig.opsPhoneHours || env.NEXT_PUBLIC_OPS_HOURS || '',
    chatMode:
      staticConfig.chatMode ||
      (apiConfig.cloudChatEligible ? 'cloud' : 'legacy'),
    isChatEligibleMember:
      (apiConfig.isChatEligibleMember as boolean | string) || false,
    isChatAvailable: (apiConfig.isChatAvailable as boolean | string) || false,
    userID: user.userID || '',
    MEMBER_ID: user.userID || '',
    memberMedicalPlanID: plan.memberMedicalPlanID || '',
    chatHours: staticConfig.chatHours || env.NEXT_PUBLIC_CHAT_HOURS || '',
    rawChatHrs: staticConfig.rawChatHrs || env.NEXT_PUBLIC_RAW_CHAT_HRS || '',
    audioAlertPath:
      staticConfig.audioAlertPath ||
      env.NEXT_PUBLIC_AUDIO_ALERT_PATH ||
      '/assets/genesys/notification.mp3',
    timestamp: new Date().toISOString(),
  };

  // Merge defaults with all available values (API, static, etc.)
  const config: GenesysChatConfig = {
    ...defaults,
    ...apiConfig,
    ...staticConfig,
    userID: user.userID || '',
    memberFirstname: user.memberFirstname || '',
    memberLastName: user.memberLastName || '',
    formattedFirstName: user.formattedFirstName || '',
    subscriberID: user.subscriberID || '',
    sfx: user.sfx || '',
    groupId: plan.groupId || '',
    memberClientID: plan.memberClientID || '',
    groupType: plan.groupType || '',
    memberMedicalPlanID: plan.memberMedicalPlanID || '',
    memberDOB: plan.memberDOB || '',
    clickToChatToken: (defaults.clickToChatToken || '') + '',
    clickToChatEndpoint: (defaults.clickToChatEndpoint || '') + '',
    gmsChatUrl: (defaults.gmsChatUrl || '') + '',
    widgetUrl: (defaults.widgetUrl || '') + '',
    clickToChatJs: (defaults.clickToChatJs || '') + '',
    coBrowseLicence:
      staticConfig.coBrowseLicence || env.NEXT_PUBLIC_COBROWSE_LICENSE || '',
    cobrowseSource:
      staticConfig.cobrowseSource || env.NEXT_PUBLIC_COBROWSE_SOURCE || '',
    cobrowseURL: staticConfig.cobrowseURL || env.NEXT_PUBLIC_COBROWSE_URL || '',
    chatHours:
      typeof apiConfig.chatHours === 'string'
        ? apiConfig.chatHours
        : typeof apiConfig.workingHours === 'string'
          ? apiConfig.workingHours
          : env.NEXT_PUBLIC_CHAT_HOURS || '',
    rawChatHrs:
      typeof apiConfig.rawChatHrs === 'string'
        ? apiConfig.rawChatHrs
        : env.NEXT_PUBLIC_RAW_CHAT_HRS || '',
    audioAlertPath: (defaults.audioAlertPath || '') + '',
    MEMBER_ID: (defaults.MEMBER_ID || '') + '',
    isChatEligibleMember:
      typeof defaults.isChatEligibleMember === 'string' ||
      typeof defaults.isChatEligibleMember === 'boolean'
        ? defaults.isChatEligibleMember
        : '',
    isChatAvailable:
      typeof defaults.isChatAvailable === 'string' ||
      typeof defaults.isChatAvailable === 'boolean'
        ? defaults.isChatAvailable
        : '',
    opsPhone: staticConfig.opsPhone || env.NEXT_PUBLIC_OPS_PHONE || '',
    opsPhoneHours:
      staticConfig.opsPhoneHours || env.NEXT_PUBLIC_OPS_HOURS || '',
    idCardChatBotName: staticConfig.idCardChatBotName || '',
    chatTokenEndpoint:
      staticConfig.chatTokenEndpoint || endpoints.CHAT_TOKEN_ENDPOINT || '',
    coBrowseEndpoint:
      staticConfig.coBrowseEndpoint ||
      endpoints.COBROWSE_LICENSE_ENDPOINT ||
      '',
    timestamp: new Date().toISOString(),
  };

  // Validate that all required fields are present and log each missing field
  const requiredFields = [
    'clickToChatToken',
    'clickToChatEndpoint',
    'gmsChatUrl',
    'widgetUrl',
    'clickToChatJs',
    'coBrowseLicence',
    'cobrowseSource',
    'cobrowseURL',
    'userID',
    'MEMBER_ID',
    'memberMedicalPlanID',
    'isChatEligibleMember',
    'isChatAvailable',
    'chatHours',
    'rawChatHrs',
  ];
  const missingFields = requiredFields.filter(
    (field) => !config[field as keyof GenesysChatConfig],
  );
  if (missingFields.length > 0) {
    logger.error(
      `[buildGenesysChatConfig] Config missing required fields: ${missingFields.join(', ')}`,
    );
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
    timestamp: config.timestamp,
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
        window.chatSettings = config as ChatSettings;
      }
    });
  }, [fetchConfig]);
}
