import { z } from 'zod';

export const GenesysConfigSchema = z.object({
  deploymentId: z.string().min(1, 'Deployment ID is required'),
  environment: z.string().min(1, 'Environment is required'),
  orgId: z.string().optional(),
});

export const PortalConfigSchema = z.object({
  url: z.string().url('Portal URL must be a valid URL'),
});

export const ClientConfigSchema = z.object({
  genesys: GenesysConfigSchema,
  portal: PortalConfigSchema,
});

export const ServerConfigSchema = z.object({
  portalServices: z.object({
    url: z
      .string()
      .min(1, 'Portal services URL is required')
      .refine((value) => {
        try {
          // Allow for relative URLs or properly formatted absolute URLs
          if (value.startsWith('/') || value.startsWith('http')) {
            return true;
          }
          // Try to create a URL object to validate
          new URL(value.includes('://') ? value : `https://${value}`);
          return true;
        } catch {
          return false;
        }
      }, 'Portal services URL must be a valid URL'),
    memberServiceRoot: z.string().min(1, 'Member service root is required'),
  }),
  elasticSearch: z.object({
    apiUrl: z
      .string()
      .min(1, 'Elastic Search API URL is required')
      .refine((value) => {
        try {
          // Allow for relative URLs or properly formatted absolute URLs
          if (value.startsWith('/') || value.startsWith('http')) {
            return true;
          }
          // Try to create a URL object to validate
          new URL(value.includes('://') ? value : `https://${value}`);
          return true;
        } catch {
          return false;
        }
      }, 'Elastic Search API URL must be a valid URL'),
    portalServicesApiUrl: z
      .string()
      .min(1, 'Portal services API URL is required')
      .refine((value) => {
        try {
          // Allow for relative URLs or properly formatted absolute URLs
          if (value.startsWith('/') || value.startsWith('http')) {
            return true;
          }
          // Try to create a URL object to validate
          new URL(value.includes('://') ? value : `https://${value}`);
          return true;
        } catch {
          return false;
        }
      }, 'Portal services API URL must be a valid URL'),
  }),
});

export const PublicConfigSchema = z.object({}).strict();

export const AppConfigSchema = z.object({
  client: ClientConfigSchema,
  server: ServerConfigSchema,
  public: PublicConfigSchema,
});

export function validateConfig<T>(
  schema: z.ZodSchema<T>,
  config: unknown,
  context: string,
): T {
  const result = schema.safeParse(config);
  if (!result.success) {
    console.error(`Invalid ${context} configuration:`, result.error);
    throw new Error(
      `Invalid ${context} configuration: ${result.error.message}`,
    );
  }
  return result.data;
}
