/**
 * GenesysChatConfig DTO: All required fields for widgets.min.js and click_to_chat.js
 * Each field is annotated with its ideal source in a modern app.
 */
import type {
  BaseGenesysChatConfig,
  CloudChatConfig,
  GenesysChatConfig,
  LegacyChatConfig,
} from '../types/chat-types';
import { isCloudChatConfig, isLegacyChatConfig } from '../types/chat-types';
export type { GenesysChatConfig };

// Define minimal types for user, plan, apiConfig
export interface UserConfig {
  userID: string;
  memberFirstname?: string;
  memberLastName?: string;
  formattedFirstName?: string;
  subscriberID?: string;
  sfx?: string;
  memberDOB?: string;
  firstName?: string;
  lastName?: string;
  subscriberId?: string;
  suffix?: string;
}

export interface PlanConfig {
  memberMedicalPlanID: string;
  groupId?: string;
  memberClientID?: string;
  groupType?: string;
  memberDOB?: string;
}

export interface ApiConfig {
  [key: string]: unknown;
}

import { LoggedInMember } from '@/models/app/loggedin_member';
import { UserProfile } from '@/models/user_profile';
import { MemberPlan } from '@/userManagement/models/plan';
import { SessionUser } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import type { CurrentPlanDetails } from '../stores/chatStore';

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
const REQUIRED_CONFIG_FIELDS: Array<
  keyof BaseGenesysChatConfig | keyof LegacyChatConfig | keyof CloudChatConfig
> = [
  'userID', // Always needed for user identity (from BaseGenesysChatConfig)
  'isChatEligibleMember', // Needed for eligibility (from BaseGenesysChatConfig)
  'targetContainer', // Needed for widget rendering (from BaseGenesysChatConfig)
  'isChatAvailable', // From BaseGenesysChatConfig
  'chatMode', // From BaseGenesysChatConfig (discriminator)
  // Legacy specific required fields (conditionally checked)
  // 'clickToChatToken', // Example: from LegacyChatConfig
  // 'clickToChatEndpoint', // Example: from LegacyChatConfig
  // Cloud specific required fields (conditionally checked)
  // 'deploymentId', // Example: from CloudChatConfig
  // 'orgId', // Example: from CloudChatConfig
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
  const missingFields: string[] = [];

  // Check base required fields
  if (!config.userID) missingFields.push('userID');
  if (config.isChatEligibleMember === undefined)
    missingFields.push('isChatEligibleMember');
  if (!config.targetContainer) missingFields.push('targetContainer');
  if (config.isChatAvailable === undefined)
    missingFields.push('isChatAvailable');
  if (!config.chatMode)
    missingFields.push('chatMode (discriminator property is missing)');

  // Check mode-specific required fields
  if (config.chatMode === 'legacy') {
    const legacyConfig = config as Partial<LegacyChatConfig>;
    if (!legacyConfig.clickToChatToken)
      missingFields.push('clickToChatToken (for legacy mode)');
    if (!legacyConfig.clickToChatEndpoint)
      missingFields.push('clickToChatEndpoint (for legacy mode)');
    if (!legacyConfig.gmsChatUrl)
      missingFields.push('gmsChatUrl (for legacy mode)');
    if (!legacyConfig.widgetUrl)
      missingFields.push('widgetUrl (for legacy mode)');
    if (!legacyConfig.clickToChatJs)
      missingFields.push('clickToChatJs (for legacy mode)');
  } else if (config.chatMode === 'cloud') {
    const cloudConfig = config as Partial<CloudChatConfig>;
    if (!cloudConfig.deploymentId)
      missingFields.push('deploymentId (for cloud mode)');
    if (!cloudConfig.orgId) missingFields.push('orgId (for cloud mode)');
    if (!cloudConfig.environment)
      missingFields.push('environment (for cloud mode)');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Build a GenesysChatConfig from user/session, plan/group, and API/static config sources.
 * @param loggedInMember - user/session context (from auth/session)
 * @param sessionUser - user/session context (from auth/session)
 * @param userProfile - user/session context (from auth/session)
 * @param apiConfig - config/flags from API (eligibility, endpoints, etc)
 * @param currentPlanDetails - current plan details from session
 * @param staticConfig - static config (env, hardcoded, etc)
 */
export function buildGenesysChatConfig({
  loggedInMember,
  sessionUser,
  userProfile,
  apiConfig,
  currentPlanDetails,
  staticConfig = {},
}: {
  loggedInMember: LoggedInMember;
  sessionUser: SessionUser;
  userProfile: UserProfile;
  apiConfig: ApiConfig;
  currentPlanDetails: CurrentPlanDetails;
  staticConfig?: Partial<GenesysChatConfig>;
}): GenesysChatConfig {
  // Validate input parameters
  if (!loggedInMember) {
    const error = new Error(
      'LoggedInMember context is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing loggedInMember context', {
      error,
    });
    throw error;
  }
  if (!sessionUser) {
    const error = new Error(
      'SessionUser context is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing sessionUser context', {
      error,
    });
    throw error;
  }
  if (!userProfile) {
    const error = new Error(
      'UserProfile context is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing userProfile context', {
      error,
    });
    throw error;
  }
  if (!currentPlanDetails) {
    const error = new Error(
      'CurrentPlanDetails is required for building chat config',
    );
    logger.error('[buildGenesysChatConfig] Missing currentPlanDetails', {
      error,
    });
    throw error;
  }

  // --- Begin derived context mapping ---
  const finalUserID = loggedInMember.userId || userProfile.id || sessionUser.id;
  if (!finalUserID) {
    const error = new Error('User ID is required and could not be determined');
    logger.error('[buildGenesysChatConfig] Missing derived userID', { error });
    throw error;
  }

  const finalFirstName = loggedInMember.firstName || userProfile.firstName;
  const finalLastName = loggedInMember.lastName || userProfile.lastName;
  // formattedFirstName can be the same as firstName or have specific logic if needed
  const finalFormattedFirstName = finalFirstName;

  const finalSubscriberID = loggedInMember.subscriberId;
  const finalSfx =
    loggedInMember.suffix !== undefined
      ? String(loggedInMember.suffix)
      : undefined;

  const finalMemberDOB = loggedInMember.dateOfBirth || userProfile.dob;

  const currentPlanContext = sessionUser.currUsr?.plan;
  if (!currentPlanContext) {
    const error = new Error(
      'Current plan context (sessionUser.currUsr.plan) is required',
    );
    logger.error('[buildGenesysChatConfig] Missing sessionUser.currUsr.plan', {
      error,
    });
    throw error;
  }

  const finalMemberMedicalPlanID = currentPlanContext.subId; // Assuming subId from active plan context is the relevant plan ID
  if (!finalMemberMedicalPlanID) {
    const error = new Error(
      'Member Medical Plan ID is required (from sessionUser.currUsr.plan.subId)',
    );
    logger.error(
      '[buildGenesysChatConfig] Missing derived memberMedicalPlanID',
      { error },
    );
    throw error;
  }

  const finalGroupId = currentPlanContext.grpId || loggedInMember.groupId;
  const finalMemberClientID =
    currentPlanContext.ntwkId ||
    loggedInMember.lineOfBusiness ||
    loggedInMember.lob;
  // groupType derivation can be complex; using a simple source for now
  const finalGroupType = loggedInMember.groupName || currentPlanContext.grpId; // Example, might need more specific logic

  // --- End derived context mapping ---

  // Determine chatMode
  const chatMode =
    apiConfig.cloudChatEligible || process.env.NEXT_PUBLIC_CHAT_MODE === 'cloud'
      ? 'cloud'
      : 'legacy';

  // Base config from API and context
  const baseConfig = {
    // From Derived Context
    userID: finalUserID,
    memberFirstname: finalFirstName,
    memberLastName: finalLastName,
    formattedFirstName: finalFormattedFirstName,
    subscriberID: finalSubscriberID,
    sfx: finalSfx,
    MEMBER_ID: `${finalSubscriberID || ''}-${finalSfx || ''}`, // Ensure fallback for potentially undefined parts
    memberDOB: finalMemberDOB,

    memberMedicalPlanID: finalMemberMedicalPlanID,
    groupId: finalGroupId,
    memberClientID: finalMemberClientID,
    groupType: finalGroupType,

    // From CurrentPlanDetails
    numberOfPlans: currentPlanDetails.numberOfPlans,
    currentPlanName: currentPlanDetails.currentPlanName,
    LOB:
      currentPlanDetails.currentPlanLOB ||
      loggedInMember.lineOfBusiness ||
      loggedInMember.lob,
    INQ_TYPE: (apiConfig.INQ_TYPE as string) || 'General Inquiry',

    // From API Config (getChatInfo response)
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

  let finalConfig: GenesysChatConfig;

  if (chatMode === 'cloud') {
    const cloudSpecificConfig: Omit<
      CloudChatConfig,
      keyof BaseGenesysChatConfig | 'chatMode'
    > = {
      deploymentId:
        (apiConfig.genesysCloudConfig as any)?.deploymentId ||
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
        '6200855c-734b-4ebd-b169-790103ec1bbb',
      orgId:
        (apiConfig.genesysCloudConfig as any)?.orgId ||
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID ||
        'default-org-id',
      environment:
        (apiConfig.genesysCloudConfig as any)?.environment ||
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
        'prod-usw2',
      genesysWidgetUrl: process.env.NEXT_PUBLIC_GENESYS_MESSENGER_URL,
    };
    finalConfig = {
      ...baseConfig,
      ...cloudSpecificConfig,
      chatMode: 'cloud',
    } as CloudChatConfig;

    // Fallbacks for cloud mode critical fields
    // if (!finalConfig.deploymentId) ...
    // if (!finalConfig.orgId) ...
    // if (!finalConfig.environment) ...
  } else {
    // Legacy mode

    // Resolve and validate critical legacy fields FIRST
    const resolvedClickToChatToken =
      ((apiConfig.getToken || apiConfig.clickToChatToken) as string) ||
      process.env.NEXT_PUBLIC_DEFAULT_CLICK_TO_CHAT_TOKEN;
    if (!resolvedClickToChatToken) {
      const errorMsg =
        '[buildGenesysChatConfig] CRITICAL: clickToChatToken is missing for legacy mode. This must be provided by the API response (getChatInfo) or the NEXT_PUBLIC_DEFAULT_CLICK_TO_CHAT_TOKEN environment variable.';
      logger.error(errorMsg, {
        apiConfigProvidedToken:
          apiConfig.clickToChatToken || apiConfig.getToken,
        envProvidedToken: process.env.NEXT_PUBLIC_DEFAULT_CLICK_TO_CHAT_TOKEN,
      });
      throw new Error(errorMsg);
    }

    // Ensure resolvedClickToChatEndpoint uses the GMS URL
    const resolvedClickToChatEndpoint =
      (apiConfig.gmsChatUrl as string) || process.env.NEXT_PUBLIC_GMS_CHAT_URL;
    if (!resolvedClickToChatEndpoint) {
      const errorMsg =
        '[buildGenesysChatConfig] CRITICAL: clickToChatEndpoint (derived from GMS URL) is missing for legacy mode. This must be provided by the API response (gmsChatUrl) or the NEXT_PUBLIC_GMS_CHAT_URL environment variable.';
      // Log which sources were attempted for GMS URL
      logger.error(errorMsg, {
        apiConfigProvidedGmsUrl: apiConfig.gmsChatUrl,
        envProvidedGmsUrl: process.env.NEXT_PUBLIC_GMS_CHAT_URL,
      });
      throw new Error(errorMsg);
    }

    // Resolve and validate gmsChatUrl
    const resolvedGmsChatUrl =
      (apiConfig.gmsChatUrl as string) || process.env.NEXT_PUBLIC_GMS_CHAT_URL;
    if (!resolvedGmsChatUrl) {
      const errorMsg =
        '[buildGenesysChatConfig] CRITICAL: gmsChatUrl is missing for legacy mode. This must be provided by the API response (gmsChatUrl) or the NEXT_PUBLIC_GMS_CHAT_URL environment variable.';
      logger.error(errorMsg, {
        apiConfigProvidedGmsUrl: apiConfig.gmsChatUrl,
        envProvidedGmsUrl: process.env.NEXT_PUBLIC_GMS_CHAT_URL,
      });
      throw new Error(errorMsg);
    }

    const legacySpecificConfig: Omit<
      LegacyChatConfig,
      keyof BaseGenesysChatConfig | 'chatMode'
    > = {
      clickToChatToken: resolvedClickToChatToken,
      clickToChatEndpoint: resolvedClickToChatEndpoint,
      gmsChatUrl: resolvedGmsChatUrl,
      widgetUrl:
        process.env.NEXT_PUBLIC_GENESYS_WIDGET_URL ||
        '/assets/genesys/plugins/widgets.min.js',
      clickToChatJs:
        process.env.NEXT_PUBLIC_CLICK_TO_CHAT_JS_URL ||
        '/assets/genesys/click_to_chat.js',
      chatTokenEndpoint:
        (apiConfig.chatTokenEndpoint as string) || '/api/chat/token',
      chatBtnText:
        (apiConfig.chatBtnText as string) ||
        (!!apiConfig.isAmplifyMem ? 'Chat with an advisor' : 'Chat Now'),
      chatWidgetTitle:
        (apiConfig.chatWidgetTitle as string) || 'Customer Service Chat',
      chatWidgetSubtitle:
        (apiConfig.chatWidgetSubtitle as string) || "We're here to help.",
      enableCobrowse: (apiConfig.enableCobrowse as boolean) || false,
      showChatButton: (apiConfig.showChatButton as boolean) ?? true,
    };

    finalConfig = {
      ...baseConfig,
      ...legacySpecificConfig,
      chatMode: 'legacy',
    } as LegacyChatConfig;

    // It's also good practice to check other critical fields like gmsChatUrl, widgetUrl, clickToChatJs if they don't have sensible universal fallbacks
    // For now, focusing on the token and primary endpoint as per immediate context.

    // Fallbacks for legacy mode critical fields (these were commented out, ensure they are handled or explicitly required)
    // if (!finalConfig.clickToChatToken) ...
    // if (!finalConfig.clickToChatEndpoint) ...
    // if (!finalConfig.gmsChatUrl) ...
    // if (!finalConfig.widgetUrl) ...
    // if (!finalConfig.clickToChatJs) ...
  }

  // Common static/defaultable fields (can be part of BaseGenesysChatConfig defaults or applied here)
  // Many of these are already in BaseGenesysChatConfig definition with optional modifier or set in baseConfig.
  // We ensure they have values if not provided by API or specific logic.
  finalConfig.coBrowseLicence =
    finalConfig.coBrowseLicence ||
    process.env.NEXT_PUBLIC_COBROWSE_LICENCE ||
    'YOUR_COBROWSE_LICENCE';
  finalConfig.cobrowseSource =
    finalConfig.cobrowseSource ||
    process.env.NEXT_PUBLIC_COBROWSE_SOURCE ||
    'YOUR_COBROWSE_SOURCE';
  finalConfig.cobrowseURL =
    finalConfig.cobrowseURL ||
    process.env.NEXT_PUBLIC_COBROWSE_URL ||
    'YOUR_COBROWSE_URL';
  finalConfig.coBrowseEndpoint =
    finalConfig.coBrowseEndpoint ||
    (apiConfig.coBrowseEndpoint as string) ||
    '/api/cobrowse';
  finalConfig.opsPhone =
    finalConfig.opsPhone ||
    process.env.NEXT_PUBLIC_OPS_PHONE ||
    '1-800-MEMBER-LINE';
  finalConfig.opsPhoneHours =
    finalConfig.opsPhoneHours ||
    process.env.NEXT_PUBLIC_OPS_PHONE_HOURS ||
    'M-F 8am-6pm EST';
  finalConfig.idCardChatBotName =
    finalConfig.idCardChatBotName ||
    (apiConfig.chatIDChatBotName as string) ||
    'ID Card Bot';

  // Merge with any staticConfig overrides passed in
  let mergedConfig: GenesysChatConfig;
  if (finalConfig.chatMode === 'legacy') {
    mergedConfig = {
      ...finalConfig,
      ...(staticConfig as Partial<LegacyChatConfig>),
    } as LegacyChatConfig;
  } else {
    // chatMode === 'cloud'
    mergedConfig = {
      ...finalConfig,
      ...(staticConfig as Partial<CloudChatConfig>),
    } as CloudChatConfig;
  }

  // Final validation using the updated validateGenesysChatConfig
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
    planId: mergedConfig.memberMedicalPlanID || finalMemberMedicalPlanID,
    isEligible: mergedConfig.isChatEligibleMember,
  });

  // Log the full config for debugging in development
  if (process.env.NODE_ENV === 'development') {
    logger.info('[buildGenesysChatConfig] Full config for debugging', {
      key_fields: {
        userID: mergedConfig.userID,
        planId: mergedConfig.memberMedicalPlanID,
        chatMode: mergedConfig.chatMode,
        ...(isLegacyChatConfig(mergedConfig)
          ? {
              clickToChatToken: mergedConfig.clickToChatToken,
              clickToChatEndpoint: mergedConfig.clickToChatEndpoint,
              clickToChatDemoEndPoint: mergedConfig.clickToChatDemoEndPoint,
              gmsChatUrl: mergedConfig.gmsChatUrl,
            }
          : {}),
        ...(isCloudChatConfig(mergedConfig)
          ? {
              deploymentId: mergedConfig.deploymentId,
              orgId: mergedConfig.orgId,
              environment: mergedConfig.environment,
            }
          : {}),
      },
    });
    // Extra: Console log for browser debugging
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[GenesysChatConfig] Key fields:', {
        userID: mergedConfig.userID,
        planId: mergedConfig.memberMedicalPlanID,
        chatMode: mergedConfig.chatMode,
        ...(isLegacyChatConfig(mergedConfig)
          ? {
              clickToChatToken: mergedConfig.clickToChatToken,
              clickToChatEndpoint: mergedConfig.clickToChatEndpoint,
              clickToChatDemoEndPoint: mergedConfig.clickToChatDemoEndPoint,
              gmsChatUrl: mergedConfig.gmsChatUrl,
            }
          : {}),
        ...(isCloudChatConfig(mergedConfig)
          ? {
              deploymentId: mergedConfig.deploymentId,
              orgId: mergedConfig.orgId,
              environment: mergedConfig.environment,
            }
          : {}),
      });
    }
  }

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
        // click_to_chat.js expects window.chatSettings to be LegacyChatConfig
        if (config.chatMode === 'legacy') {
          window.chatSettings = config as LegacyChatConfig;
        } else {
          // For cloud mode, window.chatSettings might not be directly used by Genesys scripts
          // but can be set for consistency or if our components expect it.
          // Or, you might choose to set a different global var for cloud config if needed.
          (window as any).genesysCloudChatSettings = config; // Example
        }
        // Optionally, always set a generic config object
        (window as any).currentGenesysChatConfig = config;
      }
    });
  }, [fetchConfig]);
}
