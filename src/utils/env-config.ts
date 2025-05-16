/**
 * Central configuration file for environment variables
 * This ensures consistent access to environment variables throughout the app
 */

import { AppConfig, ClientConfig, ServerConfig } from '@/types/config';
import {
  AppConfigSchema,
  ClientConfigSchema,
  ServerConfigSchema,
  validateConfig,
} from './config-validation';
import { logger } from './logger';

// Environment-specific configurations
const environments = {
  development: {
    genesys: {
      deploymentId: '52dd824c-f565-47a6-a6d5-f30d81c97491',
      environment: 'dev-usw2',
    },
  },
  production: {
    genesys: {
      deploymentId: '6200855c-734b-4ebd-b169-790103ec1bbb',
      environment: 'prod-usw2',
    },
  },
} as const;

// Helper function to check if we're running in a server context
export const isServer = typeof window === 'undefined';

// Debug logging for environment variables
console.log('DEBUG ENV VARS:', {
  PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL,
  MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT,
  ES_API_URL: process.env.ES_API_URL,
  ES_PORTAL_SVCS_API_URL: process.env.ES_PORTAL_SVCS_API_URL,
});

// Server-side configuration
export const serverConfig: ServerConfig = validateConfig(
  ServerConfigSchema,
  {
    portalServices: {
      url: process.env.PORTAL_SERVICES_URL
        ? process.env.PORTAL_SERVICES_URL.trim()
        : 'https://api3.bcbst.com/stge/soa/api/portalsvcs', // Default fallback
      memberServiceRoot: process.env.MEMBERSERVICE_CONTEXT_ROOT
        ? process.env.MEMBERSERVICE_CONTEXT_ROOT.trim()
        : '/memberservice', // Default fallback
    },
    elasticSearch: {
      apiUrl: process.env.ES_API_URL
        ? process.env.ES_API_URL.trim()
        : 'https://api3.bcbst.com/stge/soa/api/entsvcs', // Default fallback
      portalServicesApiUrl: process.env.ES_PORTAL_SVCS_API_URL
        ? process.env.ES_PORTAL_SVCS_API_URL.trim()
        : 'https://api3.bcbst.com/stge/soa/api/portalsvcs', // Default fallback
    },
  },
  'server',
);

// Client-side configuration
export const clientConfig: ClientConfig = validateConfig(
  ClientConfigSchema,
  {
    genesys: {
      deploymentId:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID ||
        environments[process.env.NODE_ENV as keyof typeof environments]?.genesys
          .deploymentId ||
        '',
      environment:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT ||
        environments[process.env.NODE_ENV as keyof typeof environments]?.genesys
          .environment ||
        'prod-usw2',
    },
    portal: {
      url: process.env.NEXT_PUBLIC_PORTAL_URL || '',
    },
  },
  'client',
);

// Combined configuration
export const config: AppConfig = validateConfig(
  AppConfigSchema,
  {
    client: clientConfig,
    server: serverConfig,
    public: {} as Record<string, never>,
  },
  'app',
);

// Type-safe accessor
export function getConfig<T extends keyof AppConfig>(scope: T): AppConfig[T] {
  return config[scope];
}

// Helper function to get environment-specific configuration
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return environments[env as keyof typeof environments];
}

// Logging helper
export function logConfig() {
  logger.info('Configuration:', {
    environment: process.env.NODE_ENV,
    client: clientConfig,
    server: isServer ? serverConfig : 'Server config not available in client',
  });
}

/**
 * Safe getter for environment variables that handles both client and server contexts
 * @param key The environment variable name
 * @param defaultValue Optional default value if the environment variable is undefined
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  // Only access server-side variables when running on the server
  if (isServer || key.startsWith('NEXT_PUBLIC_')) {
    return process.env[key] || defaultValue;
  }

  return defaultValue;
}
