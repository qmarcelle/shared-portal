/**
 * Genesys Chat Configuration
 * Centralized configuration for both Web Messaging and legacy chat.js implementations
 */
import { z } from 'zod';
import { ChatError } from '../types/index';

// Configuration validation schemas
const baseConfigSchema = z.object({
  userData: z.object({
    memberId: z.string(),
    planId: z.string(),
    planName: z.string(),
  }),
  styling: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
  }),
});

const webMessagingConfigSchema = baseConfigSchema.extend({
  deploymentId: z.string(),
  region: z.string(),
});

const legacyChatConfigSchema = baseConfigSchema.extend({
  chatGroup: z.string(),
  displayName: z.string(),
  businessHours: z.object({
    timezone: z.string(),
    format: z.literal('DAY_DAY_HOUR_HOUR'),
    value: z.string(),
  }),
});

// Environment configuration
export const GENESYS_CONFIG = {
  deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
  region: process.env.NEXT_PUBLIC_GENESYS_REGION || 'us-east-1',
  orgId: process.env.NEXT_PUBLIC_GENESYS_ORG_ID || '',
  queueName: process.env.NEXT_PUBLIC_CHAT_QUEUE_NAME || 'default',
} as const;

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
 * Get Genesys configuration based on eligibility.
 * This function implements the widget selection logic:
 * - For cloud-eligible members: Generates Web Messaging configuration
 * - For non-cloud-eligible members: Generates legacy chat.js configuration
 */
export function getGenesysConfig(options: {
  memberId: string;
  planId: string;
  planName: string;
  eligibility: { cloudChatEligible: boolean; chatGroup?: string };
}): unknown {
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
      deploymentId: GENESYS_CONFIG.deploymentId,
      region: GENESYS_CONFIG.region,
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
 */
export async function initializeChat(
  config: unknown,
  isCloudEligible: boolean,
): Promise<void> {
  try {
    if (isCloudEligible) {
      webMessagingConfigSchema.parse(config);
      await initializeWebMessaging(config);
    } else {
      legacyChatConfigSchema.parse(config);
      await initializeLegacyChat(config);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ChatError(
        `Invalid chat configuration: ${error.errors[0].message}`,
        'CONFIGURATION_ERROR',
      );
    }
    throw new ChatError('Failed to initialize chat', 'INITIALIZATION_ERROR');
  }
}

/**
 * Initialize Web Messaging (Genesys Cloud).
 * Loads the Web Messaging script from the region-specific URL if needed,
 * then configures the Web Messenger widget.
 */
async function initializeWebMessaging(config: unknown): Promise<void> {
  if (!window.Genesys?.WebMessenger) {
    await loadScript(
      `https://apps.${GENESYS_CONFIG.region}/widgets/web-messenger.js`,
    );
  }

  window.Genesys?.WebMessenger?.configure(config);
}

/**
 * Initialize Legacy Chat.js.
 * Loads the legacy chat.js script if needed,
 * then configures the legacy Chat widget.
 */
async function initializeLegacyChat(config: unknown): Promise<void> {
  if (!window.Genesys?.Chat) {
    await loadScript('/assets/genesys/click_to_chat.js');
  }

  window.Genesys?.Chat?.configure(config);
}

/**
 * Load script helper function.
 * Handles the dynamic loading of the appropriate chat script:
 * - Removes any existing script with the same ID
 * - Creates a new script element with the correct source
 * - Returns a promise that resolves when the script is loaded
 */
async function loadScript(src: string): Promise<void> {
  try {
    const existingScript = document.getElementById('cx-widget-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'cx-widget-script';
    script.src = src;
    script.async = true;

    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load script'));
      document.head.appendChild(script);
    });
  } catch (error) {
    throw new ChatError('Failed to load script', 'SCRIPT_LOAD_ERROR');
  }
}

/**
 * Destroy chat instance based on implementation.
 * Calls the appropriate destroy method based on eligibility
 * and removes the script from the DOM.
 */
export function destroyChat(isCloudEligible: boolean): void {
  try {
    if (isCloudEligible) {
      window.Genesys?.WebMessenger?.destroy();
    } else {
      window.Genesys?.Chat?.destroy();
    }
    const script = document.getElementById('cx-widget-script');
    if (script) script.remove();
  } catch (error) {
    console.error('Failed to destroy chat:', error);
  }
}
