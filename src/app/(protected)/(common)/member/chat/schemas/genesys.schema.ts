import { z } from 'zod';

/**
 * Genesys configuration schema for validating chat configuration.
 * This schema ensures that all required properties are present and correctly typed.
 */
export const ChatConfigSchema = z.object({
  // Core configuration
  chatbotEligible: z.union([z.boolean(), z.string()]).default(true),
  routingchatbotEligible: z.union([z.boolean(), z.string()]).default(true),
  clientId: z.string().optional(),
  chatUrl: z.string().optional(),
  environment: z.string().optional(),
  debug: z.boolean().optional().default(false),

  // Availability
  isChatAvailable: z.union([z.boolean(), z.string()]).default(true),

  // Member information
  memberCk: z.string().optional(),
  userRole: z.string().optional(),
  isAmplifyMem: z.boolean().optional().default(false),

  // Optional properties
  isDemoMember: z.boolean().optional(),
  isDental: z.boolean().optional(),
  isMedical: z.boolean().optional(),
  isVision: z.boolean().optional(),
  isWellnessOnly: z.boolean().optional(),
  isCobraEligible: z.boolean().optional(),
  groupType: z.string().optional(),
  isIDCardEligible: z.union([z.boolean(), z.string()]).optional(),
  calculatedCiciId: z.string().optional(),
  rawChatHrs: z.string().optional(),
  clickToChatEndPoint: z.string().optional(),
  clickToChatDemoEndPoint: z.string().optional(),

  // Cloud eligibility
  cloudChatEligible: z.boolean().optional().default(false),
  workingHours: z.string().optional(),
  chatGroup: z.string().optional(),
});

export type GenesysConfig = z.infer<typeof ChatConfigSchema>;
export type ChatConfig = z.infer<typeof ChatConfigSchema>;

/**
 * Creates a Genesys configuration object for the chat widget.
 *
 * @param config - Partial configuration to merge with defaults
 * @returns Complete Genesys configuration
 */
export const createGenesysConfig = (
  config: Partial<GenesysConfig> = {},
): GenesysConfig => {
  return ChatConfigSchema.parse({
    chatbotEligible: true,
    routingchatbotEligible: true,
    isChatAvailable: true,
    isAmplifyMem: false,
    cloudChatEligible: false,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
    ...config,
  });
};
