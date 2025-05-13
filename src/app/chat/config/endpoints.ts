/**
 * Genesys Chat API Endpoint Configuration
 *
 * This file centralizes all API endpoints for the Genesys chat integration.
 * All environments and fallbacks are handled here.
 */

// Base URLs by environment
const PRODUCTION_BASE_URL = 'https://api.bcbst.com/prod/soa/api/cci';
const STAGING_BASE_URL = 'https://api3.bcbst.com/stge/soa/api/cci';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Use the appropriate base URL based on environment
const BASE_URL = isDevelopment ? STAGING_BASE_URL : PRODUCTION_BASE_URL;

// Bot IDs by environment
const PRODUCTION_BOT_ID = '000H6aM187VE5P28';
const STAGING_BOT_ID =
  process.env.NEXT_PUBLIC_CHAT_BOT_ID_STAGING || '000H6aM187VE5P28'; // Fallback to prod ID if not set

// Use the appropriate bot ID based on environment
const BOT_ID = isDevelopment ? STAGING_BOT_ID : PRODUCTION_BOT_ID;

// Define centralized API endpoints with proper environment handling
export const CHAT_ENDPOINTS = {
  // API endpoints
  CHAT_SESSION_ENDPOINT: `${BASE_URL}/genesyschat`,
  CHAT_TOKEN_ENDPOINT: `${BASE_URL}/genesystoken`,
  COBROWSE_LICENSE_ENDPOINT: `${BASE_URL}/cobrowselicense`,

  // Chat interaction endpoints
  CHAT_SERVICE_ID: BOT_ID,
  CHAT_SEND_MESSAGE_ENDPOINT: `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/send`,
  CHAT_REFRESH_ENDPOINT: `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/refresh`,
  CHAT_TYPING_ENDPOINT: `${PRODUCTION_BASE_URL}/chatbot/${BOT_ID}/startTyping`,

  // Static asset paths (these are the same across environments)
  WIDGETS_SCRIPT_URL: '/assets/genesys/plugins/widgets.min.js',
  CLICK_TO_CHAT_SCRIPT_URL: '/assets/genesys/click_to_chat.js',
  WIDGETS_CSS_URL: '/assets/genesys/plugins/widgets.min.css',
};

// Default config for all endpoints
export const getChatConfig = () => {
  // Debug environment detection
  console.log('[getChatConfig] Environment info:', {
    NODE_ENV: process.env.NODE_ENV,
    isDevelopment,
    usingBaseUrl: BASE_URL,
    botId: BOT_ID,
    timestamp: new Date().toISOString(),
  });

  return {
    ENV_NAME: isDevelopment ? 'STAGING' : 'PRODUCTION',
    BASE_URL,
    BOT_ID,
    CLICK_TO_CHAT_ENDPOINT: CHAT_ENDPOINTS.CHAT_SESSION_ENDPOINT,
    CHAT_TOKEN_ENDPOINT: CHAT_ENDPOINTS.CHAT_TOKEN_ENDPOINT,
    COBROWSE_LICENSE_ENDPOINT: CHAT_ENDPOINTS.COBROWSE_LICENSE_ENDPOINT,
    CHAT_SERVICE_ID: CHAT_ENDPOINTS.CHAT_SERVICE_ID,
    CHAT_SEND_MESSAGE_ENDPOINT: CHAT_ENDPOINTS.CHAT_SEND_MESSAGE_ENDPOINT,
    CHAT_REFRESH_ENDPOINT: CHAT_ENDPOINTS.CHAT_REFRESH_ENDPOINT,
    CHAT_TYPING_ENDPOINT: CHAT_ENDPOINTS.CHAT_TYPING_ENDPOINT,
  };
};

export default getChatConfig;
