/**
 * Chat Utility Functions
 *
 * This file contains utility functions for chat functionality including:
 * - Working hours interpretation
 * - Business hours formatting
 * - Availability messaging
 * - ID generation
 */

import { BusinessHours } from '../models/types';
import type { LoggedInUserInfo } from './types';

/**
 * Maps user information to chat payload format
 * @param userInfo User information from API
 * @param selectedMember Selected member information
 * @param planId Optional plan ID
 */
export function mapUserInfoToChatPayload(
  userInfo: LoggedInUserInfo,
  selectedMember: Partial<LoggedInUserInfo> | null = null,
  planId: string | null = null,
): any {
  if (!userInfo) return null;

  const member = selectedMember || userInfo;

  return {
    MEMBER_ID: member.subscriberID || '',
    SERV_Type: 'MemberPortal',
    firstname: member.subscriberFirstName || '',
    lastname: member.subscriberLastName || '',
    PLAN_ID:
      planId ||
      member.members?.[0]?.planDetails.find((pd) => pd.productCategory === 'M')
        ?.planID ||
      '',
    GROUP_ID: member.groupData?.groupID || '',
    Origin: 'MemberPortal' as const,
    Source: 'Web' as const,
    INQ_TYPE: 'MEM',
    RoutingChatbotInteractionId: `MP-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
    IsVisionEligible: false,
    IsDentalEligible: false,
    IsMedicalEligibile: true,
    MEMBER_DOB: String(member.subscriberDateOfBirth || ''),
    LOB: 'Medical',
    lob_group: 'Commercial',
    coverage_eligibility: true,
  };
}

/**
 * Interprets working hours string from the API and determines if chat is currently available
 *
 * @param workingHoursStr Format: "M_F_8_6" for Mon-Fri 8am-6pm or "S_S_24" for 24/7
 * @returns Object with availability information
 */
export function interpretWorkingHours(workingHoursStr: string): {
  isAvailable: boolean;
  is24Hours?: boolean;
} {
  return { isAvailable: isWithinBusinessHours(workingHoursStr) };
}

/**
 * Determines if the current time is within business hours
 * @param hoursStr Format: "M_F_8_6" for Mon-Fri 8am-6pm or "S_S_24" for 24/7
 * @returns boolean indicating if current time is within business hours
 */
export const isWithinBusinessHours = (hoursStr: string): boolean => {
  if (!hoursStr || hoursStr === '') return false;
  if (hoursStr === 'S_S_24') return true;

  try {
    const [startDay, endDay, startHour, endHour] = hoursStr.split('_');
    if (!startDay || !endDay || !startHour || !endHour) return false;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();

    // Map day codes to numeric values (0 = Sunday, 1 = Monday, etc.)
    const dayMap: Record<string, number> = {
      A: 0, // Sunday
      M: 1, // Monday
      T: 2, // Tuesday
      W: 3, // Wednesday
      R: 4, // Thursday
      F: 5, // Friday
      S: 6, // Saturday
    };

    const startDayNum = dayMap[startDay];
    const endDayNum = dayMap[endDay];

    if (startDayNum === undefined || endDayNum === undefined) return false;

    // Check if current day is within range
    const isInDayRange =
      startDayNum <= endDayNum
        ? currentDay >= startDayNum && currentDay <= endDayNum
        : currentDay >= startDayNum || currentDay <= endDayNum;

    if (!isInDayRange) return false;

    // Check if current hour is within range
    const startHourNum = parseInt(startHour, 10);
    const endHourNum = parseInt(endHour, 10);
    // Convert end hour to 24-hour format if it's PM (less than 12)
    const endHourConverted = endHourNum < 12 ? endHourNum + 12 : endHourNum;
    return currentHour >= startHourNum && currentHour < endHourConverted;
  } catch (error) {
    return false;
  }
};

/**
 * Creates a human-readable string representing the business hours
 * @param hoursStr Format: "M_F_8_6" for Mon-Fri 8am-6pm or "S_S_24" for 24/7
 * @returns Friendly string for display to users
 */
export const formatBusinessHours = (hoursStr: string): string => {
  if (!hoursStr || hoursStr === '') return 'Closed';
  if (hoursStr === 'S_S_24') return '24/7';

  try {
    const [startDay, endDay, startHour, endHour] = hoursStr.split('_');
    if (!startDay || !endDay || !startHour || !endHour) return 'Closed';

    const dayMap: Record<string, string> = {
      M: 'Monday',
      T: 'Tuesday',
      W: 'Wednesday',
      R: 'Thursday',
      F: 'Friday',
      S: 'Saturday',
      A: 'Sunday',
    };

    const startHourNum = parseInt(startHour, 10);
    const endHourNum = parseInt(endHour, 10);

    // Convert 24-hour format to 12-hour format with AM/PM
    const formatHour = (hour: number): string => {
      if (hour === 0) return '12:00 AM';
      if (hour === 12) return '12:00 PM';
      const period = hour < 12 ? 'AM' : 'PM';
      const hourStr = hour <= 12 ? hour : hour - 12;
      return `${hourStr}:00 ${period}`;
    };

    const startHourStr = formatHour(startHourNum);
    const endHourStr = formatHour(endHourNum === 6 ? 18 : endHourNum); // Convert 6 to 18 for PM

    if (startDay === endDay) {
      return `${dayMap[startDay]} ${startHourStr} - ${endHourStr}`;
    }

    return `${dayMap[startDay]} - ${dayMap[endDay]}, ${startHourStr} - ${endHourStr}`;
  } catch (error) {
    return 'Closed';
  }
};

/**
 * Parses business hours string into structured format
 * @param hoursStr Format: "M_F_8_6" for Mon-Fri 8am-6pm or "S_S_24" for 24/7
 * @returns Array of business hours by day
 */
export const parseBusinessHours = (hoursStr: string): BusinessHours['days'] => {
  const defaultDays = [
    { day: 'Monday', openTime: '12:00 AM', closeTime: 'Closed', isOpen: false },
    {
      day: 'Tuesday',
      openTime: '12:00 AM',
      closeTime: 'Closed',
      isOpen: false,
    },
    {
      day: 'Wednesday',
      openTime: '12:00 AM',
      closeTime: 'Closed',
      isOpen: false,
    },
    {
      day: 'Thursday',
      openTime: '12:00 AM',
      closeTime: 'Closed',
      isOpen: false,
    },
    { day: 'Friday', openTime: '12:00 AM', closeTime: 'Closed', isOpen: false },
    {
      day: 'Saturday',
      openTime: '12:00 AM',
      closeTime: 'Closed',
      isOpen: false,
    },
    { day: 'Sunday', openTime: '12:00 AM', closeTime: 'Closed', isOpen: false },
  ];

  if (!hoursStr || hoursStr === '') return defaultDays;
  if (hoursStr === 'S_S_24') {
    return defaultDays.map((day) => ({
      ...day,
      isOpen: true,
      openTime: '12:00 AM',
      closeTime: '11:59 PM',
    }));
  }

  try {
    const [startDay, endDay, startHour, endHour] = hoursStr.split('_');
    if (!startDay || !endDay || !startHour || !endHour) return defaultDays;

    const dayMap: Record<string, string> = {
      M: 'Monday',
      T: 'Tuesday',
      W: 'Wednesday',
      R: 'Thursday',
      F: 'Friday',
      S: 'Saturday',
      A: 'Sunday',
    };

    const startDayName = dayMap[startDay];
    const endDayName = dayMap[endDay];
    const startTime = '8:00 AM';
    const endTime = '6:00 PM';

    return defaultDays.map((day) => {
      const isInRange = isInDayRange(day.day, startDayName, endDayName);
      return {
        ...day,
        isOpen: isInRange,
        openTime: isInRange ? startTime : 'Closed',
        closeTime: isInRange ? endTime : 'Closed',
      };
    });
  } catch (error) {
    return defaultDays;
  }
};

/**
 * Helper function to determine if a day falls within a range
 */
const isInDayRange = (
  day: string,
  startDay: string,
  endDay: string,
): boolean => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayIndex = days.indexOf(day);
  const startIndex = days.indexOf(startDay);
  const endIndex = days.indexOf(endDay);

  if (startIndex <= endIndex) {
    return dayIndex >= startIndex && dayIndex <= endIndex;
  } else {
    return dayIndex >= startIndex || dayIndex <= endIndex;
  }
};

/**
 * Generates a unique interaction ID for chat sessions
 * @returns A unique string ID
 */
export const generateInteractionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `MP-${timestamp}-${random}`;
};

/**
 * Gets a user-friendly message about chat availability
 * @param isOpen Whether chat is currently available
 * @param nextOpeningTime Optional next opening time
 * @returns Message about chat availability
 */
export const getChatAvailabilityMessage = (
  isOpen: boolean,
  nextOpeningTime?: string,
): string => {
  if (isOpen) return 'Chat is currently available';
  if (nextOpeningTime) return `Chat will be available at ${nextOpeningTime}`;
  return 'Chat is currently unavailable';
};

/**
 * Formats a date for chat display
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatChatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

/**
 * Sanitizes text for chat display
 * @param text The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeChatText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
