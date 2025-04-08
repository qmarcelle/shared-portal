import { z } from 'zod';

// Environment configuration schema
export const envConfigSchema = z.object({
  NEXT_PUBLIC_CHAT_PROVIDER: z.enum(['cloud', 'legacy']),
  NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID: z.string().min(1),
  NEXT_PUBLIC_GENESYS_REGION: z.string().min(1),
  NEXT_PUBLIC_CHAT_DATA_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Feature flags schema
export const featureFlagsSchema = z.object({
  webMessaging: z.boolean(),
  planSwitching: z.boolean(),
  businessHours: z.boolean(),
  cobrowse: z.boolean(),
});

// Styling configuration schema
export const stylingConfigSchema = z.object({
  theme: z.object({
    light: z.object({
      primaryColor: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
    }),
    dark: z.object({
      primaryColor: z.string(),
      backgroundColor: z.string(),
      textColor: z.string(),
    }),
  }),
  typography: z.object({
    fontFamily: z.string(),
    fontSize: z.object({
      small: z.string(),
      medium: z.string(),
      large: z.string(),
    }),
  }),
  spacing: z.object({
    small: z.string(),
    medium: z.string(),
    large: z.string(),
  }),
  borderRadius: z.string(),
});

// Widget configuration schema
export const widgetConfigSchema = z.object({
  containerClass: z.string(),
  headerConfig: z.object({
    title: z.string(),
    closeButton: z.boolean(),
    minimizeButton: z.boolean(),
  }),
  features: z.object({
    enableFileUpload: z.boolean(),
    enableEmoji: z.boolean(),
    enableTypingIndicator: z.boolean(),
  }),
});

// Business hours schema
export const businessHoursConfigSchema = z.object({
  timezone: z.string(),
  format: z.enum(['12hour', '24hour']),
  defaultSchedule: z.string(),
});

// Unified chat configuration schema
export const chatConfigSchema = z.object({
  env: z.object({
    provider: z.enum(['cloud', 'legacy']),
    features: featureFlagsSchema,
    genesys: z.object({
      deploymentId: z.string(),
      region: z.string(),
    }),
  }),
  styling: stylingConfigSchema,
  widget: widgetConfigSchema,
  businessHours: businessHoursConfigSchema,
  features: featureFlagsSchema,
});

// Export types
export type EnvConfig = z.infer<typeof envConfigSchema>;
export type FeatureFlags = z.infer<typeof featureFlagsSchema>;
export type StylingConfig = z.infer<typeof stylingConfigSchema>;
export type WidgetConfig = z.infer<typeof widgetConfigSchema>;
export type BusinessHoursConfig = z.infer<typeof businessHoursConfigSchema>;
export type ChatConfig = z.infer<typeof chatConfigSchema>;

// Validation functions
export const validateEnvConfig = (config: unknown) =>
  envConfigSchema.safeParse(config);
export const validateChatConfig = (config: unknown) =>
  chatConfigSchema.safeParse(config);
