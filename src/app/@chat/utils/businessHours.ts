/**
 * Utility functions for business hours calculations
 */

/**
 * Calculates if current time is within business hours
 * Business hours format: "M_F_8_6" or "S_S_24"
 * 
 * @param hoursString Business hours string (e.g. "M_F_8_6" for Mon-Fri 8AM-6PM)
 * @returns Boolean indicating if current time is within business hours
 */
export function calculateIsBusinessHoursOpen(hoursString?: string): boolean {
  if (!hoursString || hoursString.trim() === '') return false;
  
  // Handle 24/7 availability
  if (hoursString.includes('24')) return true;
  
  // Parse hours string: "M_F_8_6" means Monday to Friday, 8AM to 6PM
  const parts = hoursString.split('_');
  if (parts.length < 4) return false;
  
  const startDay = getDayNumber(parts[0]);
  const endDay = getDayNumber(parts[1]);
  const startHour = parseInt(parts[2], 10);
  const endHour = parseInt(parts[3], 10);
  
  // Get current date in client's timezone
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentHour = now.getHours();
  
  // Check if current day is within business days
  if (startDay <= endDay) {
    // Regular week (e.g., Monday to Friday)
    if (currentDay < startDay || currentDay > endDay) return false;
  } else {
    // Week wraps around (e.g., Saturday to Tuesday)
    if (currentDay < startDay && currentDay > endDay) return false;
  }
  
  // Check if current hour is within business hours
  if (startHour <= endHour) {
    // Regular day (e.g., 8AM to 6PM)
    return currentHour >= startHour && currentHour < endHour;
  } else {
    // Day wraps around (e.g., 8PM to 6AM)
    return currentHour >= startHour || currentHour < endHour;
  }
}

/**
 * Formats business hours string for display
 * 
 * @param hoursString Business hours string (e.g. "M_F_8_6" for Mon-Fri 8AM-6PM)
 * @returns Formatted business hours string for display
 */
export function formatBusinessHours(hoursString?: string): string {
  if (!hoursString || hoursString.trim() === '') {
    return 'Hours unavailable';
  }
  
  // Handle 24/7 availability
  if (hoursString.includes('24')) {
    return '24/7 support available';
  }
  
  const parts = hoursString.split('_');
  if (parts.length < 4) return 'Hours format error';
  
  const startDay = getDayName(parts[0]);
  const endDay = getDayName(parts[1]);
  const startHour = formatHour(parseInt(parts[2], 10));
  const endHour = formatHour(parseInt(parts[3], 10));
  
  return `${startDay} - ${endDay}, ${startHour} - ${endHour}`;
}

/**
 * Converts day abbreviation to day number
 * @param day Day abbreviation (M, T, W, TH, F, S, SU)
 * @returns Day number (0-6, where 0 is Sunday)
 */
function getDayNumber(day: string): number {
  switch (day.toUpperCase()) {
    case 'SU': return 0;
    case 'M': return 1;
    case 'T': return 2;
    case 'W': return 3;
    case 'TH': return 4;
    case 'F': return 5;
    case 'S': return 6;
    default: return -1;
  }
}

/**
 * Converts day abbreviation to full day name
 * @param day Day abbreviation (M, T, W, TH, F, S, SU)
 * @returns Full day name
 */
function getDayName(day: string): string {
  switch (day.toUpperCase()) {
    case 'SU': return 'Sunday';
    case 'M': return 'Monday';
    case 'T': return 'Tuesday';
    case 'W': return 'Wednesday';
    case 'TH': return 'Thursday';
    case 'F': return 'Friday';
    case 'S': return 'Saturday';
    default: return day;
  }
}

/**
 * Formats hour in 12-hour format
 * @param hour Hour in 24-hour format (0-23)
 * @returns Hour in 12-hour format with AM/PM
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}