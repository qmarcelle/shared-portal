/**
 * Genesys Chat API Endpoint Configuration
 *
 * This file centralizes all API endpoints for the Genesys chat integration.
 * Endpoints are organized by environment (staging/production) with clear naming.
 */

// Determine the current environment
const isProduction =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_USE_PROD_CHAT === 'true';

// Base URLs for different environments
const STAGING_BASE_URL = 'https://api3.bcbst.com/stge/soa/api/cci';
const PRODUCTION_BASE_URL = 'https://api.bcbst.com/prod/soa/api/cci';

// Bot ID for production endpoints
const BOT_ID = '000H6aM187VE5P28';

// Configuration object with all endpoints
export const CHAT_ENDPOINTS = {
  // Session management endpoints
  CHAT_SESSION_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/genesyschat`
    : `${STAGING_BASE_URL}/genesyschat`,

  // Authentication endpoints
  CHAT_TOKEN_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/genesystoken`
    : `${STAGING_BASE_URL}/genesystoken`,

  // Co-browse functionality
  COBROWSE_LICENSE_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/cobrowselicense`
    : `${STAGING_BASE_URL}/cobrowselicense`,

  // Messaging endpoints (production format has BOT_ID)
  SEND_MESSAGE_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/send`
    : `${STAGING_BASE_URL}/chatbot/send`,

  REFRESH_MESSAGES_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/refresh`
    : `${STAGING_BASE_URL}/chatbot/refresh`,

  TYPING_INDICATOR_ENDPOINT: isProduction
    ? `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/startTyping`
    : `${STAGING_BASE_URL}/chatbot/startTyping`,

  // Script URLs for click-to-chat functionality
  WIDGETS_SCRIPT_URL: '/assets/genesys/plugins/widgets.min.js',
  CLICK_TO_CHAT_SCRIPT_URL: '/assets/genesys/click_to_chat.js',
};

/**
 * Returns all chat configuration values needed for environment setup
 */
export function getChatConfig() {
  return {
    CLICK_TO_CHAT_ENDPOINT: CHAT_ENDPOINTS.CHAT_SESSION_ENDPOINT,
    CHAT_TOKEN_ENDPOINT: CHAT_ENDPOINTS.CHAT_TOKEN_ENDPOINT,
    COBROWSE_LICENSE_ENDPOINT: CHAT_ENDPOINTS.COBROWSE_LICENSE_ENDPOINT,
    WIDGETS_SCRIPT_URL: CHAT_ENDPOINTS.WIDGETS_SCRIPT_URL,
    CLICK_TO_CHAT_SCRIPT_URL: CHAT_ENDPOINTS.CLICK_TO_CHAT_SCRIPT_URL,
    IS_PRODUCTION: isProduction,
    ENV_NAME: isProduction ? 'production' : 'staging',
  };
}
