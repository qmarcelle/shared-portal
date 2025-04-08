import { BusinessHours } from '../../models/types';

// Mapping of day names to numeric day of week (0 = Sunday, 1 = Monday, etc.)
const DAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Mapping of short day codes to full names
const DAY_CODE_MAP: Record<string, string> = {
  S: 'Sunday',
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  R: 'Thursday',
  F: 'Friday',
  A: 'Saturday', // 'A' is sometimes used in legacy systems for Saturday
};

/**
 * Parse a time string (HH:MM) into hours and minutes
 */
export function parseTime(timeString: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Check if the current time is within the specified business hours
 */
export function isWithinBusinessHours(businessHours: BusinessHours): boolean {
  // Always available if open 24/7
  if (businessHours.isOpen24x7) {
    return true;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find the business hours for the current day
  const todayHours = businessHours.days.find(
    (day) => DAY_MAP[day.day] === currentDay,
  );

  // Not available if no hours defined for today
  if (!todayHours) {
    return false;
  }

  // Parse opening and closing times
  const { hours: openHour, minutes: openMinute } = parseTime(
    todayHours.openTime,
  );
  const { hours: closeHour, minutes: closeMinute } = parseTime(
    todayHours.closeTime,
  );

  // Convert current time to minutes for easier comparison
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  // Check if current time is within business hours
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
}

/**
 * Parse legacy chat hours format (e.g., "M_F_8_6" for Mon-Fri 8am-6pm)
 * @param chatHoursStr Legacy format string
 * @returns Structured business hours object
 */
export function parseLegacyChatHours(chatHoursStr: string): BusinessHours {
  if (!chatHoursStr) {
    return {
      isOpen24x7: false,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: false,
      lastUpdated: Date.now(),
      source: 'api',
    };
  }

  // Check for 24/7 availability format
  if (chatHoursStr.includes('_24')) {
    return {
      isOpen24x7: true,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: false,
      lastUpdated: Date.now(),
      source: 'api',
    };
  }

  const parts = chatHoursStr.split('_');

  // Not enough parts for valid format
  if (parts.length < 3) {
    return {
      isOpen24x7: false,
      days: [],
      timezone: 'America/New_York',
      isCurrentlyOpen: false,
      lastUpdated: Date.now(),
      source: 'api',
    };
  }

  const startDayCode = parts[0];
  const endDayCode = parts[1];
  const startHour = parseInt(parts[2], 10);
  // Default to 17 (5pm) if no end hour specified
  const endHour = parts.length >= 4 ? parseInt(parts[3], 10) : 17;

  // Convert to 24-hour format if needed
  const startHour24 = startHour < 12 && startHour !== 0 ? startHour : startHour;
  let endHour24 = endHour;

  // Adjust end hour to PM (e.g., 6 becomes 18) unless it's already in 24-hour format
  if (endHour < 12 && endHour !== 0) {
    endHour24 = endHour + 12;
  }

  // Generate list of days between start and end day
  const days = [];
  const startDayIndex = getValueFromDayCode(startDayCode);
  const endDayIndex = getValueFromDayCode(endDayCode);

  if (startDayIndex !== -1 && endDayIndex !== -1) {
    // Handle wrap-around cases (e.g., Saturday to Tuesday)
    let currentDayIndex = startDayIndex;

    do {
      // Add day with specified hours
      days.push({
        day: getDayNameFromIndex(currentDayIndex),
        openTime: `${startHour24.toString().padStart(2, '0')}:00`,
        closeTime: `${endHour24.toString().padStart(2, '0')}:00`,
        isOpen: true,
      });

      // Move to next day (with wrap-around)
      currentDayIndex = (currentDayIndex + 1) % 7;
    } while (currentDayIndex !== (endDayIndex + 1) % 7);
  }

  return {
    isOpen24x7: false,
    days,
    timezone: 'America/New_York',
    isCurrentlyOpen: false,
    lastUpdated: Date.now(),
    source: 'api',
  };
}

/**
 * Convert a day code (M, T, W, etc.) to day index (0-6)
 */
function getValueFromDayCode(code: string): number {
  const dayName = DAY_CODE_MAP[code];
  return dayName ? DAY_MAP[dayName] : -1;
}

/**
 * Convert day index (0-6) to day name
 */
function getDayNameFromIndex(index: number): string {
  return Object.keys(DAY_MAP).find((day) => DAY_MAP[day] === index) || 'Monday';
}

/**
 * Check if chat is available based on legacy chat hours string
 * @param rawChatHours Legacy chat hours format (e.g., "M_F_8_6")
 * @returns Whether chat is currently available
 */
export function checkChatHours(rawChatHours: string): boolean {
  const businessHours = parseLegacyChatHours(rawChatHours);
  return isWithinBusinessHours(businessHours);
}

/**
 * Format business hours for display
 */
export function formatBusinessHours(businessHours: BusinessHours): string {
  // Return "24/7" for always available
  if (businessHours.isOpen24x7) {
    return '24/7';
  }

  // Group days by open/close time
  const hoursByTime: Record<string, string[]> = {};

  businessHours.days.forEach(({ day, openTime, closeTime }) => {
    const timeKey = `${openTime} - ${closeTime}`;
    if (!hoursByTime[timeKey]) {
      hoursByTime[timeKey] = [];
    }
    hoursByTime[timeKey].push(day);
  });

  // If all 7 days have the same hours, use "Daily"
  if (
    Object.keys(hoursByTime).length === 1 &&
    businessHours.days.length === 7
  ) {
    const timeKey = Object.keys(hoursByTime)[0];
    return `Daily: ${timeKey}`;
  }

  // Format each group of days
  const formattedGroups = Object.entries(hoursByTime).map(([timeKey, days]) => {
    // Sort days by their numeric value
    days.sort((a, b) => DAY_MAP[a] - DAY_MAP[b]);

    // Format consecutive days as ranges (e.g., "Monday-Friday")
    let formattedDays = '';
    let rangeStart = 0;

    for (let i = 0; i <= days.length; i++) {
      const prevDay = i > 0 ? days[i - 1] : null;
      const currDay = i < days.length ? days[i] : null;

      const isPrevConsecutive =
        prevDay && currDay && DAY_MAP[currDay] - DAY_MAP[prevDay] === 1;

      if (!isPrevConsecutive && prevDay) {
        // End of a range or single day
        if (rangeStart === i - 1) {
          // Single day
          formattedDays += formattedDays
            ? `, ${days[rangeStart]}`
            : days[rangeStart];
        } else {
          // Range of days
          formattedDays += formattedDays
            ? `, ${days[rangeStart]}-${prevDay}`
            : `${days[rangeStart]}-${prevDay}`;
        }
        rangeStart = i;
      }

      if (i === days.length && currDay) {
        // Handle the last day
        formattedDays += formattedDays ? `, ${currDay}` : currDay;
      }
    }

    return `${formattedDays}: ${timeKey}`;
  });

  return formattedGroups.join(' | ');
}

/**
 * Format legacy chat hours string for human-readable display
 * @param rawChatHours Legacy chat hours format
 * @returns Formatted business hours string
 */
export function formatLegacyChatHours(rawChatHours: string): string {
  const businessHours = parseLegacyChatHours(rawChatHours);
  return formatBusinessHours(businessHours);
}

/**
 * Get business hours availability message
 */
export function getBusinessHoursMessage(businessHours: BusinessHours): string {
  if (isWithinBusinessHours(businessHours)) {
    return 'Chat is currently available';
  } else {
    return `Chat is currently unavailable. Please try again during our business hours: ${formatBusinessHours(businessHours)}`;
  }
}

/**
 * Get availability message using legacy chat hours format
 */
export function getLegacyChatHoursMessage(rawChatHours: string): string {
  const businessHours = parseLegacyChatHours(rawChatHours);
  return getBusinessHoursMessage(businessHours);
}
