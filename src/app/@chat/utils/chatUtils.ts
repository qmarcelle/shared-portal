import { logger } from '@/utils/logger';

// Define the interface for chat settings to match expected window.chatSettings
interface ChatSettings {
  [key: string]: any;
  widgetUrl: string;
  bootstrapUrl?: string;
  clickToChatJs: string;
  clickToChatEndpoint: string;
  chatTokenEndpoint: string;
  coBrowseEndpoint: string;
  opsPhone: string;
  opsPhoneHours: string;
}

/**
 * Utility functions for chat components
 * Centralizes common functionality used across different chat implementations
 */

/**
 * Ensures a value is converted to a string
 * Prevents [object Object] issues in chat settings
 */
export function ensureString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (e) {
      logger.warn('[ChatUtils] Error stringifying object', {
        value,
        error: e,
        timestamp: new Date().toISOString(),
      });
      return '';
    }
  }
  return String(value);
}

/**
 * Creates chat settings object from env vars and user data
 * Used by both legacy and cloud chat implementations
 */
export function createChatSettings(
  userData: Record<string, any>,
  mode: 'legacy' | 'cloud',
): ChatSettings {
  // Base settings from environment variables
  const settings: ChatSettings = {
    widgetUrl: ensureString(process.env.NEXT_PUBLIC_LEGACY_CHAT_URL),
    bootstrapUrl: ensureString(process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL),
    clickToChatJs: ensureString(
      process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    ),
    clickToChatEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    ),
    chatTokenEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT,
    ),
    coBrowseEndpoint: ensureString(
      process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT,
    ),
    opsPhone: ensureString(process.env.NEXT_PUBLIC_OPS_PHONE),
    opsPhoneHours: ensureString(process.env.NEXT_PUBLIC_OPS_HOURS),
  };

  // Add user data with string conversion
  if (userData) {
    Object.entries(userData).forEach(([key, value]) => {
      settings[key] = ensureString(value);
    });
  }

  // Log any object values that could cause issues
  Object.entries(settings).forEach(([key, value]) => {
    if (typeof value === 'object') {
      logger.error('[ChatUtils] Config key is an object', {
        key,
        value,
        mode,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return settings;
}

/**
 * Configures Genesys widgets for legacy chat
 * Sets up chat button appearance and position
 */
export function configureGenesysWidgets(): void {
  if (!window._genesys?.widgets?.webchat) return;

  // Configure chat button
  window._genesys.widgets.webchat.chatButton = {
    enabled: true,
    openDelay: 100,
    effectDuration: 200,
    hideDuringInvite: false,
    template:
      '<div class="cx-widget cx-webchat-chat-button cx-side-button">Chat Now</div>',
  };

  // Configure chat window position
  window._genesys.widgets.webchat.position = {
    bottom: { px: 20 },
    right: { px: 20 },
    width: { pct: 50 },
    height: { px: 400 },
  };
}
