import { z } from 'zod';

// Environment configuration schema
export const envConfigSchema = z
  .object({
    NEXT_PUBLIC_CHAT_PROVIDER: z.enum(['cloud', 'legacy']),
    NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID: z.string().min(1),
    NEXT_PUBLIC_GENESYS_REGION: z.string().min(1),
    NEXT_PUBLIC_CHAT_DATA_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  })
  .passthrough();

// Feature flags schema - our custom features
export const featureFlagsSchema = z
  .object({
    planSwitching: z.boolean(),
    businessHours: z.boolean(),
  })
  .passthrough();

// BCBST-specific styling configuration
export const stylingConfigSchema = z
  .object({
    theme: z.object({
      primaryColor: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
    }),
    typography: z.object({
      fontFamily: z.string(),
    }),
  })
  .passthrough();

// Unified chat configuration schema
export const chatConfigSchema = z
  .object({
    env: z.object({
      provider: z.enum(['cloud', 'legacy']),
      features: featureFlagsSchema,
    }),
    styling: stylingConfigSchema,
    businessHours: z.object({
      timezone: z.string(),
      format: z.enum(['DAY_DAY_HOUR_HOUR']),
    }),
  })
  .passthrough();

// Export types
export type EnvConfig = z.infer<typeof envConfigSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
export type StylingConfig = z.infer<typeof stylingConfigSchema>;
export type ChatConfig = z.infer<typeof chatConfigSchema>;

// Validation helper
export function validateConfig<T extends z.ZodSchema>(
  schema: T,
  config: unknown,
  options: { strict?: boolean } = {},
): {
  success: boolean;
  data?: z.infer<T>;
  error?: { message: string; details: z.ZodError };
} {
  try {
    return {
      success: true,
      data: options.strict ? schema.parse(config) : schema.parse(config),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Configuration validation failed',
          details: error,
        },
      };
    }
    throw error;
  }
}
