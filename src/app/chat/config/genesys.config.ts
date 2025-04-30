/**
 * Genesys Chat Configuration
 * Supports both Web Messaging and legacy chat.js implementations
 *
 * This module is responsible for:
 * 1. Determining the correct chat implementation to use (Web Messaging vs. legacy chat.js)
 * 2. Generating appropriate configuration for each implementation
 * 3. Loading the correct script dynamically
 * 4. Managing chat lifecycle (initialization and destruction)
 *
 * The widget selection logic is primarily based on the `cloudChatEligible` flag
 * in the member's eligibility data. This flag determines whether to use:
 * - Genesys Cloud Web Messaging API (modern implementation)
 * - Legacy chat.js implementation
 */
import type { ChatInfoResponse } from '@/utils/api/memberService';
import { z } from 'zod';
import { ChatError } from '../types/index';

const GENESYS_SCRIPT_ID = 'cx-widget-script';

// Configuration validation schemas
const baseConfigSchema = z.object({
  userData: z.object({
    memberId: z.string(),
    planId: z.string(),
    planName: z.string(),
  }),
  styling: z
    .object({
      primaryColor: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
    })
    .optional(),
});

const webMessagingConfigSchema = baseConfigSchema.extend({
  deploymentId: z.string(),
  region: z.string(),
});

const legacyChatConfigSchema = baseConfigSchema.extend({
  chatGroup: z.string(),
  displayName: z.string(),
  businessHours: z
    .object({
      timezone: z.string(),
      format: z.literal('DAY_DAY_HOUR_HOUR'),
      value: z.string(),
    })
    .optional(),
});

// Base configuration types
interface BaseConfig {
  userData: {
    memberId: string;
    planId: string;
    planName: string;
  };
  styling?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

interface WebMessagingConfig extends BaseConfig {
  deploymentId: string;
  region: string;
}

interface LegacyChatConfig extends BaseConfig {
  chatGroup: string;
  displayName: string;
  businessHours?: {
    timezone: string;
    format: 'DAY_DAY_HOUR_HOUR';
    value: string;
  };
}

// Default styling configuration
export const CHAT_STYLES = {
  primaryColor: '#0066CC',
  backgroundColor: '#FFFFFF',
  textColor: '#111827',
} as const;

// Default business hours configuration
export const BUSINESS_HOURS_CONFIG = {
  format: 'DAY_DAY_HOUR_HOUR' as const,
  value: 'M_F_8_6',
  timezone: 'America/New_York',
} as const;

/**
 * Validate chat configuration using Zod schemas.
 * Different validation schemas are applied based on the chat implementation:
 * - Web Messaging: Requires deploymentId and region
 * - Legacy chat.js: Requires chatGroup and displayName
 *
 * @param config - The chat configuration to validate
 * @param isCloudEligible - Whether to use Web Messaging validation
 * @throws {ChatError} If configuration is invalid
 */
function validateConfig(
  config: WebMessagingConfig | LegacyChatConfig,
  isCloudEligible: boolean,
): void {
  try {
    if (isCloudEligible) {
      webMessagingConfigSchema.parse(config);
    } else {
      legacyChatConfigSchema.parse(config);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ChatError(
        `Invalid chat configuration: ${error.errors[0].message}`,
        'CONFIGURATION_ERROR',
      );
    }
    throw error;
  }
}

/**
 * Get Genesys configuration based on eligibility.
 * This function implements the widget selection logic:
 * - For cloud-eligible members: Generates Web Messaging configuration
 * - For non-cloud-eligible members: Generates legacy chat.js configuration
 *
 * For Web Messaging, it uses environment variables:
 * - NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID
 * - NEXT_PUBLIC_GENESYS_REGION
 *
 * For legacy chat.js, it uses eligibility data and default business hours.
 *
 * @param options - Configuration options containing member and eligibility data
 * @returns Appropriate configuration based on eligibility
 */
export function getGenesysConfig(options: {
  memberId: string;
  planId: string;
  planName: string;
  eligibility: ChatInfoResponse;
}): WebMessagingConfig | LegacyChatConfig {
  const { memberId, planId, planName, eligibility } = options;
  const baseConfig = {
    userData: {
      memberId,
      planId,
      planName,
    },
    styling: CHAT_STYLES,
  };

  if (eligibility.cloudChatEligible) {
    return {
      ...baseConfig,
      deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
      region: process.env.NEXT_PUBLIC_GENESYS_REGION || '',
    };
  }

  return {
    ...baseConfig,
    chatGroup: eligibility.chatGroup || 'default',
    displayName: 'Chat with Us',
    businessHours: BUSINESS_HOURS_CONFIG,
  };
}

/**
 * Initialize chat based on eligibility.
 * This function:
 * 1. Validates the configuration
 * 2. Calls the appropriate initialization function based on eligibility
 * 3. Handles any initialization errors
 *
 * This is where the actual implementation selection occurs - either
 * initializeWebMessaging or initializeLegacyChat is called.
 *
 * @param config - Chat configuration (either Web Messaging or legacy)
 * @param isCloudEligible - Flag that determines which implementation to use
 * @throws {ChatError} If initialization fails
 */
export async function initializeChat(
  config: WebMessagingConfig | LegacyChatConfig,
  isCloudEligible: boolean,
): Promise<void> {
  try {
    validateConfig(config, isCloudEligible);
    if (isCloudEligible) {
      await initializeWebMessaging(config as WebMessagingConfig);
    } else {
      await initializeLegacyChat(config as LegacyChatConfig);
    }
  } catch (error) {
    console.error('Failed to initialize chat:', error);
    throw new ChatError('Failed to initialize chat', 'INITIALIZATION_ERROR');
  }
}

/**
 * Initialize Web Messaging (Genesys Cloud).
 * Loads the Web Messaging script from the region-specific URL if needed,
 * then configures the Web Messenger widget.
 *
 * @param config - Web Messaging specific configuration
 */
async function initializeWebMessaging(
  config: WebMessagingConfig,
): Promise<void> {
  if (!window.Genesys?.WebMessenger) {
    await loadScript(
      `https://apps.${config.region}.pure.cloud/widgets/web-messenger.js`,
    );
  }

  window.Genesys?.WebMessenger?.configure(config as any);
}

/**
 * Initialize Legacy Chat.js.
 * Loads the legacy chat.js script from the environment variable URL if needed,
 * then configures the legacy Chat widget.
 *
 * @param config - Legacy chat.js specific configuration
 */
async function initializeLegacyChat(config: LegacyChatConfig): Promise<void> {
  if (!window.Genesys?.Chat) {
    await loadScript(process.env.NEXT_PUBLIC_LEGACY_CHAT_URL || '');
  }

  window.Genesys?.Chat?.configure(config as any);
}

/**
 * Load script helper function.
 * Handles the dynamic loading of the appropriate chat script:
 * - Removes any existing script with the same ID
 * - Creates a new script element with the correct source
 * - Returns a promise that resolves when the script is loaded
 *
 * @param src - URL of the script to load
 * @throws {ChatError} If script fails to load
 */
async function loadScript(src: string): Promise<void> {
  try {
    const existingScript = document.getElementById(GENESYS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = GENESYS_SCRIPT_ID;
    script.src = src;
    script.async = true;

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load script'));
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error loading script:', error);
    throw new ChatError('Failed to load script', 'SCRIPT_LOAD_ERROR');
  }
}

/**
 * Destroy chat instance based on implementation.
 * Calls the appropriate destroy method based on eligibility
 * and removes the script from the DOM.
 *
 * @param isCloudEligible - Flag that determines which implementation to clean up
 */
export function destroyChat(isCloudEligible: boolean): void {
  try {
    if (isCloudEligible) {
      window.Genesys?.WebMessenger?.destroy();
    } else {
      window.Genesys?.Chat?.destroy();
    }
    const script = document.getElementById(GENESYS_SCRIPT_ID);
    if (script) script.remove();
  } catch (error) {
    console.error('Failed to destroy chat:', error);
  }
}
