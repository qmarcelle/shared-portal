/**
 * Central configuration file for environment variables
 * This ensures consistent access to environment variables throughout the app
 */

export const serverConfig = {
  // API endpoints
  PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL || '',
  MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT || '',
  ES_API_URL: process.env.ES_API_URL || '',
  ES_PORTAL_SVCS_API_URL: process.env.ES_PORTAL_SVCS_API_URL || '',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Helper method to log all config values for debugging
  logConfig: () => {
    console.log('SERVER ENV CONFIG:', {
      NODE_ENV: process.env.NODE_ENV,
      PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL,
      MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT,
      ES_API_URL: process.env.ES_API_URL,
      ES_PORTAL_SVCS_API_URL: process.env.ES_PORTAL_SVCS_API_URL,
    });
  },
};

// Client-side config: Only include NEXT_PUBLIC_ variables
export const clientConfig = {
  // Make sure these are prefixed with NEXT_PUBLIC_ in your .env files
  PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL || '',

  // Genesys Cloud Configuration
  GENESYS_CLOUD_DEPLOYMENT_ID:
    process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID || '',
  GENESYS_CLOUD_ENVIRONMENT:
    process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT || 'prod-usw2',

  // Helper method to log all client config values for debugging
  logConfig: () => {
    console.log('CLIENT ENV CONFIG:', {
      PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL,
      GENESYS_CLOUD_DEPLOYMENT_ID:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_DEPLOYMENT_ID,
      GENESYS_CLOUD_ENVIRONMENT:
        process.env.NEXT_PUBLIC_GENESYS_CLOUD_ENVIRONMENT,
    });
  },
};

// Public environment variables that can be used in both client and server components
export const publicConfig = {
  // Add any NEXT_PUBLIC_ variables here that you need on the client
  // Example: PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
};

// Helper function to check if we're running in a server context
export const isServer = typeof window === 'undefined';

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
