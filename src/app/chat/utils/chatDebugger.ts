/**
 * Chat Configuration Debugger Utility
 *
 * This utility helps diagnose issues with Genesys chat configuration
 * by providing detailed diagnostic information about each required value.
 */

import { logger } from '@/utils/logger';
import { ChatSettings } from '../types/index';

// Required configuration keys and their descriptions
const REQUIRED_KEYS = {
  // Core properties
  cloudChatEligible:
    'Determines which chat implementation to use (cloud vs legacy)',

  // URLs and endpoints
  clickToChatEndpoint: 'API endpoint for chat service',
  widgetUrl: 'URL for the legacy chat widget',
  bootstrapUrl: 'Bootstrap URL for Genesys',
  clickToChatJs: 'Path to click_to_chat.js script',
  chatTokenEndpoint: 'Endpoint for chat token',
  coBrowseEndpoint: 'Endpoint for co-browsing functionality',

  // Operation settings
  opsPhone: 'Operations phone number',
  opsPhoneHours: 'Hours for phone operations',

  // Authentication
  token: 'Authentication token for the chat service',
};

// Important but not strictly required keys
const OPTIONAL_KEYS = {
  chatGroup: 'Chat routing group (e.g., "Default")',
  formattedFirstName: "Member's first name",
  memberLastName: "Member's last name",
  chatHours: 'Hours when chat is available',
  rawChatHours: 'Raw format of chat hours (e.g., "S_S_24")',
  isChatEligibleMember: 'Whether member is eligible for chat',
  isChatAvailable: 'Whether chat is currently available',
  isDemoMember: 'Whether this is a demo user',
  isMedical: 'Whether member has medical coverage',
  isDental: 'Whether member has dental coverage',
  isVision: 'Whether member has vision coverage',
};

/**
 * Checks if a value is potentially valid (not empty/undefined/null)
 */
const isValuePopulated = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Validates the chat configuration and logs any issues
 * @param config The chat configuration object to validate
 * @param windowChatSettings The window.chatSettings object for cross-validation
 * @returns Validation result with missing required keys and warnings
 */
export function validateChatConfig(
  config: any,
  windowChatSettings?: any,
): {
  isValid: boolean;
  missingRequired: string[];
  warnings: string[];
} {
  const missingRequired: string[] = [];
  const warnings: string[] = [];

  // Check required keys
  Object.keys(REQUIRED_KEYS).forEach((key) => {
    if (!isValuePopulated(config[key])) {
      missingRequired.push(key);
    }
  });

  // Check optional keys
  Object.keys(OPTIONAL_KEYS).forEach((key) => {
    if (!isValuePopulated(config[key])) {
      warnings.push(`Optional setting '${key}' is not populated`);
    }
  });

  // Cross-check with window.chatSettings if provided
  if (windowChatSettings) {
    // Check if required settings are in window.chatSettings
    if (!isValuePopulated(windowChatSettings.clickToChatEndpoint)) {
      warnings.push('window.chatSettings.clickToChatEndpoint is not set');
    }
    if (!isValuePopulated(windowChatSettings.clickToChatToken)) {
      warnings.push('window.chatSettings.clickToChatToken is not set');
    }
  }

  const isValid = missingRequired.length === 0;

  // Log the results
  if (!isValid) {
    logger.error(
      '[ChatDebugger] Chat configuration is missing required values',
      {
        missingRequired,
        warnings,
        timestamp: new Date().toISOString(),
      },
    );
  } else if (warnings.length > 0) {
    logger.warn('[ChatDebugger] Chat configuration has warnings', {
      warnings,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.info('[ChatDebugger] Chat configuration is valid', {
      timestamp: new Date().toISOString(),
    });
  }

  return { isValid, missingRequired, warnings };
}

/**
 * Logs detailed diagnostic information about the chat configuration
 */
export function logChatConfigDiagnostics(
  chatSettings?: ChatSettings,
  windowChatSettings?: any,
  envVars: boolean = true,
): void {
  logger.info('[ChatDebugger] Starting chat configuration diagnostic', {
    timestamp: new Date().toISOString(),
  });

  // Log environment variables if requested
  if (envVars) {
    logger.info('[ChatDebugger] Environment variables', {
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT:
        process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT || '(not set)',
      NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT_TYPE:
        typeof process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
      NEXT_PUBLIC_LEGACY_CHAT_URL:
        process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '(not set)',
      NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL:
        process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL || '(not set)',
      NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS:
        process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS || '(not set)',
      NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT:
        process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT || '(not set)',
      NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT:
        process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT || '(not set)',
      timestamp: new Date().toISOString(),
    });
  }

  // Log chatSettings if available
  if (chatSettings) {
    const diagnostics: Record<string, any> = {};

    // Check required keys
    Object.keys(REQUIRED_KEYS).forEach((key) => {
      const value = chatSettings[key as keyof ChatSettings];
      diagnostics[key] = {
        value: typeof value === 'object' ? '(object)' : value,
        type: typeof value,
        populated: isValuePopulated(value),
        description: REQUIRED_KEYS[key as keyof typeof REQUIRED_KEYS],
      };
    });

    logger.info('[ChatDebugger] Chat settings diagnostics', {
      diagnostics,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.warn(
      '[ChatDebugger] No chatSettings object provided for diagnostic',
      {
        timestamp: new Date().toISOString(),
      },
    );
  }

  // Log window.chatSettings if available
  if (windowChatSettings) {
    logger.info('[ChatDebugger] window.chatSettings diagnostics', {
      windowChatSettings,
      timestamp: new Date().toISOString(),
    });
  }

  logger.info('[ChatDebugger] Chat configuration diagnostic complete', {
    timestamp: new Date().toISOString(),
  });
}
