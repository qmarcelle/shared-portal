/**
 * Business Hours Utility Functions
 * Functions for checking and formatting business hours
 */

/**
 * Determine if current time is within specified business hours
 * @param chatHours Chat hours code from API (e.g., 'M_F_8_6')
 * @returns boolean indicating if chat is currently available
 */
export function isWithinBusinessHours(chatHours: string): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours();

  // 24/7 availability
  if (chatHours === 'S_S_24') {
    return true;
  }

  // Monday to Friday, 8am to 6pm
  if (chatHours === 'M_F_8_6') {
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
  }

  // Monday to Friday, 8am to 8pm
  if (chatHours === 'M_F_8_8') {
    return day >= 1 && day <= 5 && hour >= 8 && hour < 20;
  }

  // Default to closed if unknown format
  return false;
}

/**
 * Parse business hours string into a structured format
 * @param chatHours Chat hours code from API (e.g., 'M_F_8_6')
 * @returns Array of business day objects with open/close times
 */
export function parseBusinessHours(chatHours: string) {
  // Default business days configuration
  const days = [
    { day: 'Monday', openTime: '8:00 AM', closeTime: '6:00 PM', isOpen: false },
    {
      day: 'Tuesday',
      openTime: '8:00 AM',
      closeTime: '6:00 PM',
      isOpen: false,
    },
    {
      day: 'Wednesday',
      openTime: '8:00 AM',
      closeTime: '6:00 PM',
      isOpen: false,
    },
    {
      day: 'Thursday',
      openTime: '8:00 AM',
      closeTime: '6:00 PM',
      isOpen: false,
    },
    { day: 'Friday', openTime: '8:00 AM', closeTime: '6:00 PM', isOpen: false },
    { day: 'Saturday', openTime: 'Closed', closeTime: 'Closed', isOpen: false },
    { day: 'Sunday', openTime: 'Closed', closeTime: 'Closed', isOpen: false },
  ];

  // Parse based on chat hours string
  if (chatHours === 'S_S_24') {
    // 24/7 availability
    return days.map((day) => ({
      ...day,
      isOpen: true,
      openTime: '12:00 AM',
      closeTime: '11:59 PM',
    }));
  } else if (chatHours === 'M_F_8_6') {
    // Monday to Friday, 8am to 6pm
    return days.map((day) => ({
      ...day,
      isOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(
        day.day,
      ),
    }));
  } else if (chatHours === 'M_F_8_8') {
    // Monday to Friday, 8am to 8pm
    return days.map((day) => ({
      ...day,
      isOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(
        day.day,
      ),
      closeTime: day.isOpen ? '8:00 PM' : day.closeTime,
    }));
  }

  return days;
}

/**
 * Format business hours for display
 * @param chatHours Chat hours code from API
 * @returns Formatted string for display
 */
export function formatBusinessHours(chatHours: string): string {
  if (chatHours === 'S_S_24') return '24/7';
  if (chatHours === 'M_F_8_6') return 'Monday - Friday, 8:00 AM - 6:00 PM';
  if (chatHours === 'M_F_8_8') return 'Monday - Friday, 8:00 AM - 8:00 PM';
  return 'Closed';
}
