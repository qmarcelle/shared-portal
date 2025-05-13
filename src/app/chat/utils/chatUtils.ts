import { logger } from '@/utils/logger';
import { CHAT_ENDPOINTS, getChatConfig } from '../config/endpoints';
import { ChatSettings } from '../types/index';

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
  logger.info('[ChatUtils] Creating chat settings', { mode, userData });
  // Debug all environment variables
  logger.info('[ChatUtils] Environment variables for chat', {
    NEXT_PUBLIC_LEGACY_CHAT_URL: process.env.NEXT_PUBLIC_LEGACY_CHAT_URL,
    NEXT_PUBLIC_LEGACY_CHAT_URL_TYPE:
      typeof process.env.NEXT_PUBLIC_LEGACY_CHAT_URL,
    NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL:
      process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
    NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL_TYPE:
      typeof process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL,
    NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS:
      process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS_TYPE:
      typeof process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS,
    NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT:
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT_TYPE:
      typeof process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT,
    mode,
    timestamp: new Date().toISOString(),
  });

  // Get configuration from centralized config
  const chatConfig = getChatConfig();

  // Use centralized endpoints with fallbacks to environment variables
  const settings: ChatSettings = {
    widgetUrl: ensureString(
      process.env.NEXT_PUBLIC_LEGACY_CHAT_URL ||
        CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL,
    ),
    bootstrapUrl: ensureString(process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL),
    clickToChatJs: ensureString(
      process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS ||
        CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL,
    ),
    clickToChatEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT ||
        chatConfig.CLICK_TO_CHAT_ENDPOINT,
    ),
    chatTokenEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT ||
        chatConfig.CHAT_TOKEN_ENDPOINT,
    ),
    coBrowseEndpoint: ensureString(
      process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT ||
        chatConfig.COBROWSE_LICENSE_ENDPOINT,
    ),
    chatServiceId: ensureString(
      process.env.NEXT_PUBLIC_CHAT_SERVICE_ID || chatConfig.CHAT_SERVICE_ID,
    ),
    chatSendMessageEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CHAT_SEND_MESSAGE_ENDPOINT ||
        chatConfig.CHAT_SEND_MESSAGE_ENDPOINT,
    ),
    chatRefreshEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CHAT_REFRESH_ENDPOINT ||
        chatConfig.CHAT_REFRESH_ENDPOINT,
    ),
    chatTypingEndpoint: ensureString(
      process.env.NEXT_PUBLIC_CHAT_TYPING_ENDPOINT ||
        chatConfig.CHAT_TYPING_ENDPOINT,
    ),
    opsPhone: ensureString(process.env.NEXT_PUBLIC_OPS_PHONE),
    opsPhoneHours: ensureString(process.env.NEXT_PUBLIC_OPS_HOURS),
  };

  // Log the generated settings
  logger.info('[ChatUtils] Final chat settings', settings);

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

/**
 * Ensures CSS for chat widgets is properly loaded
 * Fixes issues with preloaded but unused CSS
 */
export function ensureChatCssIsLoaded(): void {
  if (typeof window === 'undefined') return;

  const cssPath = '/assets/genesys/plugins/widgets.min.css';
  logger.info('[chatUtils] Ensuring CSS is loaded properly', {
    timestamp: new Date().toISOString(),
  });

  // First check if it's already loaded
  const existingLink = document.querySelector(`link[href^="${cssPath}"]`);
  if (existingLink) {
    logger.info('[chatUtils] CSS link already exists, refreshing it', {
      linkElement: existingLink.outerHTML,
      timestamp: new Date().toISOString(),
    });
    try {
      existingLink.parentNode?.removeChild(existingLink);
    } catch (e) {
      logger.error('[chatUtils] Error removing existing CSS link', {
        error: e,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Create a new link with cache-busting parameter
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = `${cssPath}?cb=${Date.now()}`;
  link.id = 'genesys-widgets-css-dynamic';

  // Add onload handler for debugging
  link.onload = () => {
    logger.info('[chatUtils] Genesys CSS loaded successfully', {
      timestamp: new Date().toISOString(),
    });
  };

  link.onerror = (error) => {
    logger.error('[chatUtils] Failed to load Genesys CSS', {
      error,
      timestamp: new Date().toISOString(),
    });

    // Apply critical CSS directly as a fallback
    applyCriticalChatButtonStyles();
  };

  document.head.appendChild(link);
}

/**
 * Applies critical CSS styles directly to ensure chat button is visible
 * Used as a fallback when CSS loading fails
 */
export function applyCriticalChatButtonStyles(): void {
  if (typeof window === 'undefined') return;

  logger.info('[chatUtils] Applying critical button styles directly', {
    timestamp: new Date().toISOString(),
  });

  // Create a style element with critical styles
  const style = document.createElement('style');
  style.id = 'genesys-critical-styles';
  style.textContent = `
    .cx-webchat-chat-button {
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: fixed !important;
      right: 20px !important;
      bottom: 20px !important;
      z-index: 9999 !important;
      background-color: #0078d4 !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
      font-family: sans-serif !important;
      font-size: 16px !important;
      font-weight: bold !important;
      text-align: center !important;
      align-items: center !important;
      justify-content: center !important;
    }
  `;

  document.head.appendChild(style);

  // Also try to apply styles directly to button if it exists
  setTimeout(() => {
    const button = document.querySelector(
      '.cx-webchat-chat-button',
    ) as HTMLElement;
    if (button) {
      button.style.cssText = `
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: fixed !important;
        right: 20px !important;
        bottom: 20px !important;
        z-index: 9999 !important;
        background-color: #0078d4 !important;
        color: white !important;
        padding: 10px 20px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
      `;
    }
  }, 1000); // Delay to ensure button is in DOM
}

/**
 * Creates an emergency chat button
 * Used when normal button initialization fails
 */
export function createEmergencyChatButton(): HTMLElement {
  logger.info('[chatUtils] Creating emergency chat button', {
    timestamp: new Date().toISOString(),
  });

  // Check if a button already exists
  const existingButton = document.querySelector(
    '#emergency-chat-button, #debug-chat-button',
  );
  if (existingButton) {
    logger.info('[chatUtils] Emergency button already exists', {
      timestamp: new Date().toISOString(),
    });
    return existingButton as HTMLElement;
  }

  const button = document.createElement('button');
  button.id = 'emergency-chat-button';
  button.textContent = 'Chat Now';
  button.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 99999;
    background-color: #0078d4;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;

  button.onclick = function () {
    openGenesysChat();
  };

  document.body.appendChild(button);
  return button;
}

/**
 * Opens the Genesys chat window
 * Enhanced implementation with multiple fallbacks and error handling
 * Supports both legacy and cloud chat modes
 */
export function openGenesysChat(): void {
  const timestamp = new Date().toISOString();
  const chatMode = window._genesys ? 'legacy' : 'cloud';
  logger.info('[ChatUtils] openGenesysChat called', { chatMode, timestamp });

  logger.info('[chatUtils] Opening Genesys chat', {
    mode: chatMode,
    timestamp,
  });

  // First, ensure CSS is loaded
  ensureChatCssIsLoaded();

  // Track if any method succeeded
  let success = false;

  // Try all available methods in order of reliability

  // Method 1: CXBus for legacy chat (most reliable for legacy)
  if (window.CXBus && typeof window.CXBus.command === 'function') {
    try {
      logger.info(
        '[ChatUtils] Opening chat via CXBus.command("WebChat.open")',
        { timestamp },
      );
      window.CXBus.command('WebChat.open');
      success = true;
      return;
    } catch (e) {
      logger.error('[ChatUtils] Error using CXBus.command', {
        error: e,
        timestamp,
      });
    }
  }

  // Method 2: Genesys widgets API
  if (window._genesys?.widgets?.webchat) {
    if (typeof window._genesys.widgets.webchat.open === 'function') {
      try {
        logger.info(
          '[ChatUtils] Opening chat via _genesys.widgets.webchat.open()',
          { timestamp },
        );
        window._genesys.widgets.webchat.open();
        success = true;
        return;
      } catch (e) {
        logger.error('[ChatUtils] Error using _genesys.widgets.webchat.open', {
          error: e,
          timestamp,
        });
      }
    }
  }

  // Method 3: Cloud Messenger API
  if (chatMode === 'cloud' && window.Genesys) {
    try {
      logger.info('[ChatUtils] Opening chat via Genesys Cloud Messenger', {
        timestamp,
      });
      window.Genesys('command', 'Messenger.open');
      success = true;
      return;
    } catch (e) {
      logger.error('[ChatUtils] Error opening Genesys Cloud Messenger', {
        error: e,
        timestamp,
      });
    }
  }

  // Method 4: DOM-based approach - find and click the button directly
  const chatButton = document.querySelector(
    '.cx-webchat-chat-button',
  ) as HTMLElement;
  if (chatButton) {
    try {
      logger.info(
        '[ChatUtils] Found chat button in DOM, clicking it directly',
        { timestamp },
      );
      chatButton.click();
      success = true;
      return;
    } catch (e) {
      logger.error('[ChatUtils] Error clicking chat button', {
        error: e,
        timestamp,
      });
    }
  }

  // If all methods failed, try emergency approach
  if (!success) {
    logger.error(
      '[ChatUtils] All standard methods failed, attempting recovery',
      { timestamp },
    );

    // Try to reload scripts and create emergency button
    setTimeout(() => {
      try {
        // Ensure CSS is loaded again
        ensureChatCssIsLoaded();

        // Apply direct styles
        applyCriticalChatButtonStyles();

        // Create emergency button
        createEmergencyChatButton();

        logger.info('[chatUtils] Recovery steps completed', {
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        logger.error('[chatUtils] Error during recovery steps:', {
          error: e,
          timestamp: new Date().toISOString(),
        });
      }
    }, 1000);
  }
}

// Get centralized chat configuration
export function getChatConfig() {
  return {
    // Default endpoint values
    CLICK_TO_CHAT_ENDPOINT: CHAT_ENDPOINTS.CLICK_TO_CHAT_ENDPOINT,
    CHAT_TOKEN_ENDPOINT: CHAT_ENDPOINTS.CHAT_TOKEN_ENDPOINT,
    COBROWSE_LICENSE_ENDPOINT: CHAT_ENDPOINTS.COBROWSE_LICENSE_ENDPOINT,
    CHAT_SERVICE_ID: CHAT_ENDPOINTS.CHAT_SERVICE_ID,
    CHAT_SEND_MESSAGE_ENDPOINT: CHAT_ENDPOINTS.CHAT_SEND_MESSAGE_ENDPOINT,
    CHAT_REFRESH_ENDPOINT: CHAT_ENDPOINTS.CHAT_REFRESH_ENDPOINT,
    CHAT_TYPING_ENDPOINT: CHAT_ENDPOINTS.CHAT_TYPING_ENDPOINT,
  };
}
