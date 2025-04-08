/**
 * Environment configuration for chat
 */

// Environment variables with type safety
export const env = {
  // Original variables
  NEXT_PUBLIC_CHAT_PROVIDER: process.env.NEXT_PUBLIC_CHAT_PROVIDER || 'genesys',
  NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID:
    process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
  NEXT_PUBLIC_GENESYS_REGION:
    process.env.NEXT_PUBLIC_GENESYS_REGION || 'us-east-1',
  NEXT_PUBLIC_GENESYS_ORG_ID: process.env.NEXT_PUBLIC_GENESYS_ORG_ID || '',
  NEXT_PUBLIC_CHAT_QUEUE_NAME:
    process.env.NEXT_PUBLIC_CHAT_QUEUE_NAME || 'default',
  NEXT_PUBLIC_CHAT_DATA_URL: process.env.NEXT_PUBLIC_CHAT_DATA_URL || '',

  // Additional variables
  CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL || '/api',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// Type for environment variables
export type EnvConfig = typeof env;

/**
 * Validates that all required environment variables are present
 */
export function validateEnv(): boolean {
  const requiredVars = [
    'NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID',
    'NEXT_PUBLIC_GENESYS_ORG_ID',
    'NEXT_PUBLIC_CHAT_DATA_URL',
  ];

  const missingVars = requiredVars.filter(
    (key) => !env[key as keyof typeof env],
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables for chat: ${missingVars.join(', ')}`,
    );
    return false;
  }

  return true;
}
