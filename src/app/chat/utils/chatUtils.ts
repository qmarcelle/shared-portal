/**
 * Chat Utility Functions
 *
 * This file contains utility functions for chat functionality including:
 * - Working hours interpretation
 * - Business hours formatting
 * - Availability messaging
 * - ID generation
 */

import type { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { ChatPayload } from '../types';

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
): ChatPayload | null {
  if (!userInfo) return null;

  const member = selectedMember || userInfo;

  return {
    memberClientID: member.subscriberID || '',
    userID: member.subscriberID || userInfo.subscriberID || '',
    planId:
      planId ||
      member.members?.[0]?.planDetails.find((pd) => pd.productCategory === 'M')
        ?.planID ||
      '',
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
  // If no working hours string provided, chat is not available
  if (!workingHoursStr) return { isAvailable: false };

  // Parse working hours string (e.g., "M_F_8_6" or "S_S_24")
  const parts = workingHoursStr.split('_');

  if (parts.length < 3) return { isAvailable: false };

  const startDay = parts[0]; // M = Monday, S = Sunday/Saturday (needs context)
  const endDay = parts[1]; // F = Friday, S = Sunday/Saturday (needs context)

  // 24-hour availability (S_S_24)
  if (parts.length === 3 && parts[2] === '24') {
    return { isAvailable: true, is24Hours: true };
  }

  // For standard hour ranges (M_F_8_18)
  if (parts.length === 4) {
    const startHour = parseInt(parts[2]); // 8 = 8am
    const endHour = parseInt(parts[3]); // 18 = 6pm

    // Check if current time is within business hours
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = currentDate.getHours();

    // Convert day strings to numeric values for comparison
    // S can be Sunday (0) or Saturday (6) depending on context
    const dayMap: Record<string, number | number[]> = {
      S: [0, 6], // Sunday, Saturday
      M: 1, // Monday
      T: 2, // Tuesday
      W: 3, // Wednesday
      R: 4, // Thursday
      F: 5, // Friday,
    };

    // Handle specific day ranges
    if (startDay === 'S' && endDay === 'S') {
      // All week availability, just check hours
      if (currentHour >= startHour && currentHour < endHour) {
        return { isAvailable: true };
      }
    } else if (startDay === 'M' && endDay === 'F') {
      // Weekday availability (Mon-Fri)
      if (
        currentDay >= 1 &&
        currentDay <= 5 &&
        currentHour >= startHour &&
        currentHour < endHour
      ) {
        return { isAvailable: true };
      }
    } else {
      // For other day ranges, handle individually
      const startDayNum = Array.isArray(dayMap[startDay])
        ? (dayMap[startDay] as number[])[0]
        : (dayMap[startDay] as number);

      const endDayNum = Array.isArray(dayMap[endDay])
        ? (dayMap[endDay] as number[])[1]
        : (dayMap[endDay] as number);

      if (
        currentDay >= startDayNum &&
        currentDay <= endDayNum &&
        currentHour >= startHour &&
        currentHour < endHour
      ) {
        return { isAvailable: true };
      }
    }
  }

  return { isAvailable: false };
}

/**
 * Creates a human-readable string representing the business hours
 *
 * @param workingHoursStr Format from API
 * @returns Friendly string for display to users
 */
export function formatBusinessHours(workingHoursStr: string): string {
  if (!workingHoursStr) return 'Hours not available';

  const parts = workingHoursStr.split('_');

  if (parts.length < 3) return 'Hours not available';

  // 24-hour availability
  if (parts.length === 3 && parts[2] === '24') {
    return 'Available 24/7';
  }

  // Map day codes to full names
  const dayNames: Record<string, string> = {
    S: 'Sunday',
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    R: 'Thursday',
    F: 'Friday',
  };

  const startDay = dayNames[parts[0]];
  const endDay = dayNames[parts[1]];

  // Convert 24-hour format to 12-hour format with AM/PM
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const startHour = formatHour(parseInt(parts[2]));
  const endHour = formatHour(parseInt(parts[3]));

  if (startDay === endDay) {
    return `${startDay} ${startHour} - ${endHour}`;
  }

  return `${startDay} - ${endDay}, ${startHour} - ${endHour}`;
}

/**
 * Determines if chat is currently available and returns appropriate message
 *
 * @param businessHours The business hours string from API
 * @returns Message indicating chat availability status
 */
export function getChatAvailabilityMessage(businessHours: string): string {
  const availability = interpretWorkingHours(businessHours);

  if (availability.isAvailable) {
    return 'Chat is currently available';
  }

  return `Chat is currently unavailable. Please try again during our business hours: ${formatBusinessHours(businessHours)}`;
}

/**
 * Generates a unique interaction ID for chat sessions
 * @returns A unique string ID
 */
export function generateInteractionId(): string {
  return `interaction-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Converts a date to a chat-friendly timestamp
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatChatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Sanitizes text for display in chat
 * @param text Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeChatText(text: string): string {
  if (!text) return '';

  // Simple HTML sanitization
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
