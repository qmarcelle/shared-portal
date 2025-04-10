/**
 * Environment configuration for chat
 */

// Provider type definition
type Provider = 'cloud' | 'onprem';

// Helper to ensure provider value is valid
const getProvider = (value: string | undefined): Provider => {
  if (value === 'cloud' || value === 'onprem') return value;
  return 'cloud'; // Default to cloud if invalid or undefined
};

// Environment variables with type safety
export const env = {
  // Chat provider
  provider: getProvider(process.env.NEXT_PUBLIC_CHAT_PROVIDER),

  // Genesys configuration
  genesys: {
    deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
    region: process.env.NEXT_PUBLIC_GENESYS_REGION || 'us-east-1',
    orgId: process.env.NEXT_PUBLIC_GENESYS_ORG_ID || '',
    queueName: process.env.NEXT_PUBLIC_CHAT_QUEUE_NAME || 'default',
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || '/api',
    dataUrl: process.env.NEXT_PUBLIC_CHAT_DATA_URL || '',
  },

  // Environment flags
  environment: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;

// Type for environment variables
export type EnvConfig = typeof env;

/**
 * Validates that all required environment variables are present
 */
export function validateEnv(): boolean {
  const requiredVars = ['genesys.deploymentId', 'genesys.orgId', 'api.dataUrl'];

  const missingVars = requiredVars.filter((path) => {
    const keys = path.split('.');
    let value: any = env;
    for (const key of keys) {
      value = value[key];
      if (!value) return true;
    }
    return false;
  });

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables for chat: ${missingVars.join(', ')}`,
    );
    return false;
  }

  return true;
}
