import { z } from 'zod';

// Configuration schema
const configSchema = z.object({
  deploymentId: z.string(),
  region: z.string(),
  planId: z.string(),
});

// Chat data payload schema based on BCBST Chat API Documentation
export const chatDataPayloadSchema = z.object({
  SERV_Type: z.string(),
  firstname: z.string(),
  RoutingChatbotInteractionId: z.string(),
  PLAN_ID: z.string(),
  lastname: z.string(),
  GROUP_ID: z.string(),
  IDCardBotName: z.string(),
  IsVisionEligible: z.boolean(),
  MEMBER_ID: z.string(),
  coverage_eligibility: z.boolean(),
  INQ_TYPE: z.string(),
  IsDentalEligible: z.boolean(),
  MEMBER_DOB: z.string(),
  LOB: z.string(),
  lob_group: z.string(),
  IsMedicalEligibile: z.boolean(),
  Origin: z.literal('MemberPortal'),
  Source: z.literal('Web'),
});

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
export const chatInfoResponseSchema = z.object({
  chatGroup: z.string(),
  workingHours: z.string(),
  chatIDChatBotName: z.string(),
  chatBotEligibility: z.boolean(),
  routingChatBotEligibility: z.boolean(),
  chatAvailable: z.boolean(),
  cloudChatEligible: z.boolean(),
});

// Business hours schema
export const businessHoursSchema = z.object({
  isOpen24x7: z.boolean(),
  days: z.array(
    z.object({
      day: z.string(),
      openTime: z.string(),
      closeTime: z.string(),
      isOpen: z.boolean(),
    }),
  ),
  timezone: z.string(),
  isCurrentlyOpen: z.boolean(),
  lastUpdated: z.number(),
  source: z.enum(['default', 'api', 'legacy']),
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
export function parseWorkingHours(workingHours: string): BusinessHours {
  // Format: DAY_DAY_HOUR_HOUR
  // Examples: M_F_8_6 (Monday to Friday, 8AM to 6PM)
  //           S_S_24 (Sunday to Saturday, 24 hours)

  const parts = workingHours.split('_');

  if (parts.length === 4) {
    const [startDay, endDay, startHour, endHour] = parts;

    // Check for 24-hour availability
    if (endHour === '24') {
      return {
        isOpen24x7: true,
        days: getDaysOfWeek(startDay, endDay).map((day) => ({
          day,
          openTime: '00:00',
          closeTime: '24:00',
          isOpen: true,
        })),
        timezone: 'America/New_York', // Default timezone
        isCurrentlyOpen: true,
        lastUpdated: Date.now(),
        source: 'api' as const,
      };
    }

    // Regular hours
    return {
      isOpen24x7: false,
      days: getDaysOfWeek(startDay, endDay).map((day) => ({
        day,
        openTime: `${startHour}:00`,
        closeTime: `${endHour}:00`,
        isOpen: true,
      })),
      timezone: 'America/New_York', // Default timezone
      isCurrentlyOpen: isCurrentlyInBusinessHours(
        startDay,
        endDay,
        startHour,
        endHour,
      ),
      lastUpdated: Date.now(),
      source: 'api' as const,
    };
  }

  // Default for invalid format
  return {
    isOpen24x7: false,
    days: [
      {
        day: 'Monday',
        openTime: '09:00',
        closeTime: '17:00',
        isOpen: false,
      },
    ],
    timezone: 'America/New_York',
    isCurrentlyOpen: false,
    lastUpdated: Date.now(),
    source: 'default' as const,
  };
}

// Helper function to get days of week
function getDaysOfWeek(startDay: string, endDay: string): string[] {
  const dayMap: Record<string, number> = {
    M: 1, // Monday
    T: 2, // Tuesday
    W: 3, // Wednesday
    R: 4, // Thursday
    F: 5, // Friday
    S: 6, // Saturday/Sunday (context dependent)
  };

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Handle special case for S_S_24
  if (startDay === 'S' && endDay === 'S') {
    return days; // All days of the week
  }

  const start = dayMap[startDay] || 1;
  const end = dayMap[endDay] || 5;

  const result: string[] = [];
  for (let i = start; i <= end; i++) {
    result.push(days[i % 7]);
  }

  return result;
}

// Helper function to check if current time is within business hours
function isCurrentlyInBusinessHours(
  startDay: string,
  endDay: string,
  startHour: string,
  endHour: string,
): boolean {
  const dayMap: Record<string, number> = {
    M: 1, // Monday
    T: 2, // Tuesday
    W: 3, // Wednesday
    R: 4, // Thursday
    F: 5, // Friday
    S: 6, // Saturday/Sunday (context dependent)
  };

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours();

  // If 24 hour service
  if (endHour === '24') {
    return true;
  }

  // Check if current day is within range
  const start = dayMap[startDay] || 1;
  const end = dayMap[endDay] || 5;

  // Special case for S_S
  if (startDay === 'S' && endDay === 'S') {
    // All days of week
    return (
      currentHour >= parseInt(startHour) && currentHour < parseInt(endHour)
    );
  }

  // Standard case
  if (currentDay >= start && currentDay <= end) {
    return (
      currentHour >= parseInt(startHour) && currentHour < parseInt(endHour)
    );
  }

  return false;
}
