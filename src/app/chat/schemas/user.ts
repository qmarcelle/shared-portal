import { z } from 'zod';

// Configuration schema
const configSchema = z.object({
  deploymentId: z.string(),
  region: z.string(),
  planId: z.string(),
});

// Chat data payload schema based on BCBST Chat API Documentation
export const chatDataPayloadSchema = z
  .object({
    // Core business fields
    PLAN_ID: z.string().min(1, 'Plan ID is required'),
    GROUP_ID: z.string().min(1, 'Group ID is required'),
    LOB: z.string().min(1, 'Line of Business is required'),
    lob_group: z.string(),

    // Eligibility flags
    IsMedicalEligibile: z.boolean(),
    IsDentalEligible: z.boolean(),
    IsVisionEligible: z.boolean(),

    // Optional fields with defaults
    Origin: z.literal('MemberPortal').default('MemberPortal'),
    Source: z.literal('Web').default('Web'),
  })
  .passthrough(); // Allow Genesys fields to pass through

// User info schema
const userInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  customFields: z.object({
    planId: z.string(),
    groupId: z.string(),
    lob: z.string().optional(),
    lobGroup: z.string().optional(),
    isMedical: z.string(),
    isDental: z.string(),
    isVision: z.string(),
  }),
});

// Chat info response schema based on BCBST Chat API Documentation
export const chatInfoResponseSchema = z
  .object({
    chatGroup: z.string(),
    workingHours: z.string(),
    chatAvailable: z.boolean(),
    cloudChatEligible: z.boolean(),
  })
  .passthrough();

// Business hours schema
export const businessHoursSchema = z.object({
  format: z.enum(['DAY_DAY_HOUR_HOUR']),
  value: z.string(),
  timezone: z.string(),
});

// Complete user data validation schema
export const genesysUserDataSchema = z.object({
  config: configSchema,
  userInfo: userInfoSchema,
  SERV_Type: z.literal('MemberPortal'),
  INQ_TYPE: z.literal('MEM'),
  RoutingChatbotInteractionId: z.string(),
  Origin: z.enum(['portal', 'web']),
  Source: z.enum(['web', 'MemberPortal']),
});

// Export types
export type UserInfo = z.infer<typeof userInfoSchema>;
export type GenesysConfig = z.infer<typeof configSchema>;
export type GenesysUserDataValidated = z.infer<typeof genesysUserDataSchema>;
export type ChatDataPayload = z.infer<typeof chatDataPayloadSchema>;
export type ChatInfoResponse = z.infer<typeof chatInfoResponseSchema>;
export type BusinessHours = z.infer<typeof businessHoursSchema>;

// Validation function
export const validateUserData = (data: unknown): GenesysUserDataValidated => {
  return genesysUserDataSchema.parse(data);
};

// Safe validation function that returns result instead of throwing
export function safeValidateUserData(userData: unknown) {
  try {
    return {
      success: true as const,
      data: genesysUserDataSchema.parse(userData),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        error: { message: error.message, details: error.format() },
      };
    }
    return {
      success: false as const,
      error: { message: 'Unknown validation error', details: error },
    };
  }
}

// Business hours parsing
export function parseWorkingHours(
  workingHours: string,
): z.infer<typeof businessHoursSchema> {
  const parts = workingHours.split('_');

  if (parts.length !== 4) {
    return {
      format: 'DAY_DAY_HOUR_HOUR',
      value: 'M_F_9_17', // Default 9-5 M-F
      timezone: 'America/New_York',
    };
  }

  return {
    format: 'DAY_DAY_HOUR_HOUR',
    value: workingHours,
    timezone: 'America/New_York',
  };
}

// Safe validation helper
export function safeValidate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): {
  success: boolean;
  data?: z.infer<T>;
  error?: { message: string; details: z.ZodError };
} {
  try {
    return {
      success: true,
      data: schema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Validation failed',
          details: error,
        },
      };
    }
    throw error; // Re-throw unexpected errors
  }
}
