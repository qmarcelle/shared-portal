// src/schemas/genesys.schema.ts
import { z } from 'zod';

/**
 * Configuration values returned by your /api/chat/info
 * that drive which widget to load and how to initialize it.
 */
export const ChatConfigSchema = z.object({
  // Whether chat is currently available (business hours, eligibility)
  isChatAvailable: z.boolean(),

  // Feature flag: true = use Genesys Cloud Messenger, false = legacy widget
  cloudChatEligible: z.boolean(),

  // For legacy: routing group name/queue
  chatGroup: z.string().optional(),

  // Human-readable business hours string (e.g. "M-F 8am-5pm")
  workingHours: z.string().optional(),
});

export type ChatConfig = z.infer<typeof ChatConfigSchema>;

/**
 * Creates a validated Genesys configuration object from raw data
 * @param data Raw configuration data
 * @returns Validated ChatConfig object
 */
export function createGenesysConfig(data: {
  isChatAvailable: boolean;
  cloudChatEligible: boolean;
  chatGroup?: string;
  workingHours?: string;
  chatbotEligible?: boolean;
  routingchatbotEligible?: boolean;
}): ChatConfig {
  return ChatConfigSchema.parse({
    isChatAvailable: data.isChatAvailable,
    cloudChatEligible: data.cloudChatEligible,
    chatGroup: data.chatGroup,
    workingHours: data.workingHours,
  });
}
