/**
 * Consolidated Chat Configuration
 *
 * This file exports all chat-related configuration, including:
 * - Environment configuration
 * - Widget configuration
 * - Feature flags
 * - Provider settings
 */

// Provider type definition
type Provider = 'cloud';

// Feature flags
export const FEATURES = {
  webMessaging: true,
  planSwitching: true,
  businessHours: true,
  cobrowse: true,
} as const;

// Environment variables
const envVars = {
  NEXT_PUBLIC_CHAT_PROVIDER: 'cloud' as Provider,
  NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID:
    process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID,
  NEXT_PUBLIC_GENESYS_REGION: process.env.NEXT_PUBLIC_GENESYS_REGION,
  NEXT_PUBLIC_CHAT_DATA_URL: process.env.NEXT_PUBLIC_CHAT_DATA_URL,
  NODE_ENV: process.env.NODE_ENV,
} as const;

// Environment configuration type
type EnvConfig = {
  readonly provider: Provider;
  readonly features: typeof FEATURES;
  readonly genesys: {
    readonly deploymentId: string;
    readonly region: string;
  };
};

// Environment configuration
export const ENV_CONFIG: EnvConfig = {
  provider: envVars.NEXT_PUBLIC_CHAT_PROVIDER,
  features: FEATURES,
  genesys: {
    deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
    region: process.env.NEXT_PUBLIC_GENESYS_REGION || '',
  },
} as const;

// Widget configuration
export const WIDGET_CONFIG = {
  containerClass: 'genesys-chat-widget',
  headerConfig: {
    title: 'Chat with us',
    closeButton: true,
    minimizeButton: true,
  },
  styling: {
    primaryColor: '#0066CC',
    fontFamily: 'system-ui, sans-serif',
    borderRadius: '8px',
  },
  features: {
    fileUpload: true,
    emoji: true,
    typing: true,
  },
} as const;

// Business hours configuration
export const BUSINESS_HOURS_CONFIG = {
  timezone: 'America/New_York',
  format: '24hour',
  defaultSchedule: 'M_F_8_6', // Monday-Friday, 8am-6pm
} as const;

// Chat configuration type
type ChatConfigType = {
  readonly env: EnvConfig;
  readonly businessHours: typeof BUSINESS_HOURS_CONFIG;
  readonly features: typeof FEATURES;
  readonly styling: typeof WIDGET_CONFIG.styling;
  readonly widget: typeof WIDGET_CONFIG;
};

// Chat configuration
export const chatConfig: ChatConfigType = {
  env: ENV_CONFIG,
  businessHours: BUSINESS_HOURS_CONFIG,
  features: FEATURES,
  styling: WIDGET_CONFIG.styling,
  widget: WIDGET_CONFIG,
} as const;

// Export type for the complete config
export type ChatConfig = typeof chatConfig;

// Default export for convenience
export default chatConfig;

export { env, validateEnv } from './env';
export { genesysConfig, updateUserData } from './genesys.config';
export type { GenesysConfig } from './genesys.config';
