// src/schemas/genesys.schema.ts
import { z } from 'zod';

/**
 * Configuration values returned by your /api/chat/info
 * that drive which widget to load and how to initialize it.
 * This schema should reflect the structure of `finalPayloadForClient` from the API route.
 */
export const ChatConfigSchema = z.object({
  // Fields directly from (or derived from) BCBST Member Service response
  isChatAvailable: z.boolean(),
  cloudChatEligible: z.boolean(),
  isEligible: z.boolean().optional(), // Assuming this might be present and is a boolean
  chatGroup: z.string().optional(),
  workingHours: z.string().optional(),
  rawChatHrs: z.string().optional(),
  chatIDChatBotName: z.string().optional(),
  chatBotEligibility: z.boolean().optional(),
  routingChatBotEligibility: z.boolean().optional(),
  isChatEligibleMember: z.union([z.string(), z.boolean()]).optional(), // From buildGenesysChatConfig logic
  chatAvailable: z.union([z.string(), z.boolean()]).optional(), // From buildGenesysChatConfig logic
  groupType: z.string().optional(), // From linter error
  INQ_TYPE: z.string().optional(), // From linter error
  isBlueEliteGroup: z.union([z.string(), z.boolean()]).optional(), // From linter error
  clientClassificationId: z.string().optional(), // From linter error

  // Specific boolean/string flags (often converted to string in buildGenesysChatConfig)
  isDemoMember: z.union([z.string(), z.boolean()]).optional(),
  isAmplifyMem: z.union([z.string(), z.boolean()]).optional(),
  isCobrowseActive: z.union([z.string(), z.boolean()]).optional(),
  enableCobrowse: z.union([z.string(), z.boolean()]).optional(), // often used interchangeably with isCobrowseActive
  isMagellanVAMember: z.union([z.string(), z.boolean()]).optional(),
  isMedicalAdvantageGroup: z.union([z.string(), z.boolean()]).optional(),
  isDental: z.union([z.string(), z.boolean()]).optional(),
  isVision: z.union([z.string(), z.boolean()]).optional(),
  isMedical: z.union([z.string(), z.boolean()]).optional(),
  isIDCardEligible: z.union([z.string(), z.boolean()]).optional(),
  isCobraEligible: z.union([z.string(), z.boolean()]).optional(),

  // Fields that might have fallbacks or are injected by the Next.js API route
  orgId: z.string().optional(),
  clickToChatEndpoint: z.string().optional(),
  gmsChatUrl: z.string().optional(),
  widgetUrl: z.string().optional(),
  clickToChatJs: z.string().optional(),

  // Token injected by the Next.js API route (from PING)
  clickToChatToken: z.string().optional(), // Was already optional, keeping it so

  // Other fields that might be part of the response or buildGenesysChatConfig logic
  coBrowseLicence: z.string().optional(),
  routingInteractionId: z.string().optional(), // Added based on ChatInfoResponse in api.ts
  selfServiceLinks: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  genesysCloudConfig: z
    .object({
      deploymentId: z.string().optional(),
      orgId: z.string().optional(),
      environment: z.string().optional(),
    })
    .optional(),
  clickToChatDemoEndPoint: z.string().optional(),
  demoGmsChatUrl: z.string().optional(),
  chatTokenEndpoint: z.string().optional(),
  chatBtnText: z.string().optional(),
  chatWidgetTitle: z.string().optional(),
  chatWidgetSubtitle: z.string().optional(),
  showChatButton: z.boolean().optional(),
  coBrowseEndpoint: z.string().optional(),
  getToken: z.string().optional(), // Referenced in legacy token resolution in buildGenesysChatConfig, though likely superseded

  // If your API route adds diagnostic fields like _mockData, _timestamp, etc.,
  // and you want them in the validated config, define them here.
  // Otherwise, use .passthrough() on the object if you want to allow unknown keys.
  // For now, keeping it strict to defined fields.
});

export type ChatConfig = z.infer<typeof ChatConfigSchema>;

/**
 * Creates a validated Genesys configuration object from raw data
 * @param data Raw configuration data
 * @returns Validated ChatConfig object
 */
export function createGenesysConfig(data: unknown): ChatConfig {
  // Changed data to unknown for broader input
  const parseResult = ChatConfigSchema.safeParse(data);
  if (!parseResult.success) {
    // Log the detailed error for better debugging if schema validation fails
    console.error(
      'ChatConfigSchema validation failed:',
      parseResult.error.flatten(),
    );
    throw new Error(
      'Failed to create Genesys config due to schema validation errors.',
    );
  }
  return parseResult.data;
}
