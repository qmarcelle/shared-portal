/**
 * Genesys Cloud Chat Configuration Builder
 * Cloud-only configuration building from member data and API responses.
 * Simplified from legacy/cloud union to cloud-only implementation.
 */

// TypeScript declaration for Node.js process environment variables
declare const process: {
  env: {
    NEXT_PUBLIC_CHAT_MODE?: string;
    NEXT_PUBLIC_CHAT_HOURS?: string;
    NEXT_PUBLIC_RAW_CHAT_HRS?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID?: string;
    NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT?: string;
    NEXT_PUBLIC_GENESYS_MESSENGER_URL?: string;
    NEXT_PUBLIC_COBROWSE_LICENCE?: string;
    NEXT_PUBLIC_COBROWSE_SOURCE?: string;
    NEXT_PUBLIC_COBROWSE_URL?: string;
    NEXT_PUBLIC_OPS_PHONE?: string;
    NEXT_PUBLIC_OPS_PHONE_HOURS?: string;
    NODE_ENV?: string;
  };
};

import type {
  BaseGenesysChatConfig,
  CloudChatConfig,
  GenesysChatConfig,
} from '../types/chat-types';
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
  clientClassificationId?: string;
}

export interface PlanConfig {
  memberMedicalPlanID: string;
  groupId?: string;
  memberClientID?: string;
  groupType?: string;
  memberDOB?: string;
  // Additional fields for click_to_chat.js compatibility
  isBlueEliteGroup?: string | boolean;
}

import { LoggedInMember } from '@/models/app/loggedin_member';
import { UserProfile } from '@/models/user_profile';
import { MemberPlan } from '@/userManagement/models/plan';
import { SessionUser } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import type { ChatConfig } from '../schemas/genesys.schema';
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

// Configuration validation fields are defined inline where needed

/**
 * Validate that a cloud-only GenesysChatConfig has all required fields
 * @param config The cloud config to validate
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
    missingFields.push('chatMode (should always be "cloud")');

  // Check cloud-specific required fields
  const cloudConfig = config as Partial<CloudChatConfig>;
  if (!cloudConfig.deploymentId)
    missingFields.push('deploymentId (required for cloud mode)');
  if (!cloudConfig.orgId) missingFields.push('orgId (required for cloud mode)');
  if (!cloudConfig.environment)
    missingFields.push('environment (required for cloud mode)');

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
 * @param loggedInUserInfo - user info from loggedInUserInfo
 */
/**
 * **CLOUD FLOW CORE** - Build cloud-only GenesysChatConfig from all data sources
 *
 * This function orchestrates the complex process of building a complete chat configuration
 * by combining member data, session context, API responses, and environment variables.
 *
 * **Flow Integration:**
 * - Called by: chatStore.loadChatConfiguration() (Step 8)
 * - Uses: getChatInfo API response + member/session data
 * - Produces: Complete CloudChatConfig for GenesysCloudLoader
 *
 * **Business Logic Preserved:**
 * - User context derivation (email, names, IDs)
 * - Plan validation and member medical plan ID requirements
 * - Coverage type analysis (dental, vision, medical)
 * - Eligibility determination and Blue Elite group logic
 * - Environment variable integration and fallbacks
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
  apiConfig: ChatConfig;
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

  // **BUSINESS LOGIC SECTION 1** - User context derivation and validation
  logger.info(
    '[buildGenesysChatConfig] [CLOUD FLOW] Starting user context derivation from member and session data.',
  );

  const finalUserID = loggedInMember.userId || userProfile.id || sessionUser.id;
  if (!finalUserID) {
    const error = new Error('User ID is required and could not be determined');
    logger.error(
      '[buildGenesysChatConfig] [CLOUD FLOW] Critical error: User ID missing from all sources.',
      { error },
    );
    throw error;
  }

  // Extract email: primarily from loggedInMember.contact.email
  let email: string | undefined = undefined;

  // 1. Try loggedInMember.contact.email
  if (
    loggedInMember &&
    loggedInMember.contact &&
    loggedInMember.contact.email
  ) {
    email = loggedInMember.contact.email;
  }

  // 2. The check for userProfile.email has been removed as UserProfile type does not define an email property.
  //    If email needs to be sourced from UserProfile in the future,
  //    the UserProfile type definition in src/models/user_profile.ts should be updated first.

  // 3. If loggedInUserInfo was intended and is passed in the future, it could be re-added here.
  // if (!email && loggedInUserInfo && Array.isArray(loggedInUserInfo.addresses)) {
  //   email = loggedInUserInfo.addresses.find((addr: any) => !!addr.email)?.email;
  // }

  // Fallback to a default string if no email is found.
  if (!email) {
    email = 'user@noemailonfile.com';
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

  // Revert to expecting sessionUser.currUsr.plan as per SessionUser type definition
  const currentPlanContext = sessionUser.currUsr?.plan;
  if (!currentPlanContext) {
    const error = new Error(
      'Current plan context (sessionUser.currUsr.plan) is required and was not found on the sessionUser object.',
    );
    logger.error('[buildGenesysChatConfig] Missing sessionUser.currUsr.plan', {
      error,
      sessionUserReceived: sessionUser, // Log the received sessionUser for inspection
    });
    throw error;
  }

  const finalMemberMedicalPlanID = currentPlanContext.subId;
  if (!finalMemberMedicalPlanID) {
    const error = new Error(
      'Member Medical Plan ID (subId) is required from sessionUser.currUsr.plan',
    );
    logger.error(
      '[buildGenesysChatConfig] Missing subId in sessionUser.currUsr.plan',
      { error, currentPlanContextReceived: currentPlanContext },
    );
    throw error;
  }

  const finalGroupId = currentPlanContext.grpId || loggedInMember.groupId; // Fallback to loggedInMember.groupId if not in plan context
  if (!finalGroupId) {
    const error = new Error(
      'Group ID (grpId) is required from sessionUser.currUsr.plan or loggedInMember.groupId',
    );
    logger.error(
      '[buildGenesysChatConfig] Missing grpId in plan context and no fallback in loggedInMember',
      {
        error,
        currentPlanContextReceived: currentPlanContext,
        loggedInMemberGroupId: loggedInMember.groupId,
      },
    );
    throw error;
  }

  const finalMemberClientID =
    currentPlanContext.ntwkId ||
    loggedInMember.lineOfBusiness ||
    loggedInMember.lob; // Fallback
  if (!finalMemberClientID) {
    logger.warn(
      '[buildGenesysChatConfig] Could not determine finalMemberClientID (ntwkId equivalent from plan or LOB fallbacks).',
    );
  }

  // Derive groupType more accurately, following client classification expectations
  const finalGroupType =
    (apiConfig.groupType as string) ||
    (loggedInMember.coverageTypes?.some((type) => type.indvGroupInd === 'INDV')
      ? 'INDV'
      : '') ||
    loggedInMember.groupName ||
    finalGroupId; // Uses reverted finalGroupId

  // Extract coverage types for dental/vision/medical flags
  const hasDental = !!loggedInMember.coverageTypes?.some((type) =>
    type.productType?.toLowerCase().includes('dental'),
  );

  const hasVision = !!loggedInMember.coverageTypes?.some((type) =>
    type.productType?.toLowerCase().includes('vision'),
  );

  const hasMedical = !!loggedInMember.coverageTypes?.some(
    (type) =>
      type.productType?.toLowerCase().includes('medical') ||
      type.productType?.toLowerCase().includes('health'),
  );

  // Derive isBlueEliteGroup from appropriate sources
  const isBlueEliteGroup =
    (apiConfig.isBlueEliteGroup as boolean | string) ||
    loggedInMember.lob === 'INDVMX' ||
    finalMemberClientID === 'INDVMX' || // Uses reverted finalMemberClientID
    false;

  // Derive clientClassificationId
  const clientClassificationId =
    (apiConfig.clientClassificationId as string) || finalMemberClientID || '';

  // --- End derived context mapping ---

  // Cloud-only mode determination
  const chatMode = 'cloud';

  // Base config from API and context
  const baseConfig = {
    // From Derived Context
    userID: finalUserID,
    memberFirstname: finalFirstName,
    memberLastName: finalLastName,
    firstname: finalFirstName,
    lastname: finalLastName,
    formattedFirstName: finalFormattedFirstName,
    subscriberID: finalSubscriberID,
    sfx: finalSfx,
    MEMBER_ID: `${finalSubscriberID || ''}-${finalSfx || ''}`, // Ensure fallback for potentially undefined parts
    memberDOB: finalMemberDOB,

    memberMedicalPlanID: finalMemberMedicalPlanID,
    groupId: finalGroupId,
    memberClientID: finalMemberClientID,
    groupType: finalGroupType,

    // Critical fields for getCalculatedCiciId() in click_to_chat.js
    isBlueEliteGroup: String(isBlueEliteGroup),
    clientClassificationId: clientClassificationId,

    // Coverage type flags
    isDental: String(
      hasDental || (apiConfig.isDental as boolean | string) || false,
    ),
    isVision: String(
      hasVision || (apiConfig.isVision as boolean | string) || false,
    ),
    isMedical: String(
      hasMedical || (apiConfig.isMedical as boolean | string) || false,
    ),

    // From CurrentPlanDetails
    numberOfPlans: currentPlanDetails.numberOfPlans,
    currentPlanName: currentPlanDetails.currentPlanName,
    LOB:
      currentPlanDetails.currentPlanLOB ||
      loggedInMember.lineOfBusiness ||
      loggedInMember.lob,
    INQ_TYPE: (apiConfig.INQ_TYPE as string) || 'General Inquiry',

    // From API Config (getChatInfo response)
    isChatEligibleMember: Boolean(
      (apiConfig.isChatEligibleMember as string | boolean | undefined) ??
        (apiConfig.isEligible as string | boolean | undefined) ??
        true,
    ),
    isChatAvailable: Boolean(
      (apiConfig.chatAvailable as boolean | undefined) ?? true,
    ),
    chatGroup: apiConfig.chatGroup as string,
    workingHours: apiConfig.workingHours as string,
    chatHours: (apiConfig.workingHours ||
      process.env.NEXT_PUBLIC_CHAT_HOURS ||
      'M-F 8am-5pm') as string,
    rawChatHrs: (apiConfig.rawChatHrs ||
      process.env.NEXT_PUBLIC_RAW_CHAT_HRS ||
      '8_17') as string,
    idCardChatBotName: apiConfig.chatIDChatBotName as string, // Assuming chatIDChatBotName is idCardChatBotName
    chatbotEligible: String(
      (apiConfig.chatBotEligibility as boolean | string) || false,
    ),
    routingchatbotEligible: String(
      (apiConfig.routingChatBotEligibility as boolean | string) || false,
    ),

    // Special member types needed by click_to_chat.js
    isDemoMember: String((apiConfig.isDemoMember as boolean | string) || false),
    isAmplifyMem: String((apiConfig.isAmplifyMem as boolean | string) || false),
    isCobrowseActive: String(
      (apiConfig.isCobrowseActive as boolean | string) ||
        (apiConfig.enableCobrowse as boolean | string) ||
        false,
    ),
    isMagellanVAMember: String(
      (apiConfig.isMagellanVAMember as boolean | string) || false,
    ),
    isMedicalAdvantageGroup: String(
      (apiConfig.isMedicalAdvantageGroup as boolean | string) || false,
    ),

    // Eligibility flags for form options
    isIDCardEligible: String(
      (apiConfig.isIDCardEligible as boolean | string) || false,
    ),
    isCobraEligible: String(
      (apiConfig.isCobraEligible as boolean | string) || false,
    ),

    // Self-service links for after-hours
    selfServiceLinks:
      (apiConfig.selfServiceLinks as Array<{ key: string; value: string }>) ||
      [],

    // Default container if not specified elsewhere
    targetContainer:
      (staticConfig.targetContainer as string) || 'genesys-chat-container',

    // Chat Mode specific
    chatMode: chatMode,
    // Add email to config
    email: email,
  };

  // Cloud-specific configuration building
  const cloudSpecificConfig: Omit<
    CloudChatConfig,
    keyof BaseGenesysChatConfig | 'chatMode'
  > = {
    deploymentId:
      ((apiConfig.genesysCloudConfig as Record<string, unknown>)
        ?.deploymentId as string) ||
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
      '6200855c-734b-4ebd-b169-790103ec1bbb',
    orgId:
      ((apiConfig.genesysCloudConfig as Record<string, unknown>)
        ?.orgId as string) ||
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_ORG_ID ||
      'default-org-id',
    environment:
      ((apiConfig.genesysCloudConfig as Record<string, unknown>)
        ?.environment as string) ||
      process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
      'prod-usw2',
    genesysWidgetUrl: process.env.NEXT_PUBLIC_GENESYS_MESSENGER_URL,
  };

  const finalConfig = {
    ...baseConfig,
    ...cloudSpecificConfig,
    chatMode: 'cloud',
  } as CloudChatConfig;

  // Common static/defaultable fields (can be part of BaseGenesysChatConfig defaults or applied here)
  // Many of these are already in BaseGenesysChatConfig definition with optional modifier or set in baseConfig.
  // We ensure they have values if not provided by API or specific logic.
  finalConfig.coBrowseLicence =
    (apiConfig.coBrowseLicence as string) || // Prioritize from apiConfig if available
    finalConfig.coBrowseLicence || // Keep existing value if apiConfig doesn't provide it
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
    finalConfig.idCardChatBotName || // This already holds apiConfig.chatIDChatBotName if provided
    'ID Card Bot'; // Simpler fallback

  // Merge with any staticConfig overrides passed in
  const mergedConfig = {
    ...finalConfig,
    ...(staticConfig as Partial<CloudChatConfig>),
  } as CloudChatConfig;

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

  logger.info(
    '[buildGenesysChatConfig] Successfully built cloud-only GenesysChatConfig',
    {
      chatMode: mergedConfig.chatMode,
      userID: mergedConfig.userID,
      planId: mergedConfig.memberMedicalPlanID,
      isEligible: mergedConfig.isChatEligibleMember,
    },
  );

  // Log the full config for debugging in development
  if (process.env.NODE_ENV === 'development') {
    logger.info('[buildGenesysChatConfig] Cloud config for debugging', {
      key_fields: {
        userID: mergedConfig.userID,
        planId: mergedConfig.memberMedicalPlanID,
        chatMode: mergedConfig.chatMode,
        deploymentId: mergedConfig.deploymentId,
        orgId: mergedConfig.orgId,
        environment: mergedConfig.environment,
      },
    });

    // Console log for browser debugging
    if (typeof window !== 'undefined') {
      console.log('[GenesysChatConfig] Cloud config key fields:', {
        userID: mergedConfig.userID,
        planId: mergedConfig.memberMedicalPlanID,
        chatMode: mergedConfig.chatMode,
        deploymentId: mergedConfig.deploymentId,
        orgId: mergedConfig.orgId,
        environment: mergedConfig.environment,
      });
    }
  }

  return mergedConfig;
}

/**
 * (Optional) React hook to fetch cloud-only GenesysChatConfig from an API
 */
import { useEffect } from 'react';
export function useGenesysChatConfig(
  fetchConfig: () => Promise<GenesysChatConfig>,
) {
  useEffect(() => {
    fetchConfig().then((config) => {
      if (typeof window !== 'undefined') {
        // Set cloud config for global access
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).genesysCloudChatSettings = config;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).currentGenesysChatConfig = config;
      }
    });
  }, [fetchConfig]);
}
