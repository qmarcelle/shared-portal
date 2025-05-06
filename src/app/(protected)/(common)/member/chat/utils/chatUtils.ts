/**
 * Chat utility functions for handling business hours and interaction IDs
 */

interface BusinessHourDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export function isWithinBusinessHours(hours: string): boolean {
  if (!hours || hours === '') return false;
  if (hours === 'S_S_24') return true;

  const match = hours.match(/^([M|T|W|F|S])_([M|T|W|F|S])_(\d+)_(\d+)$/);
  if (!match) return false;

  const [, startDay, endDay, startHour, endHour] = match;
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  // Convert days to numbers (0-6)
  const dayMap: Record<string, number> = { M: 1, T: 2, W: 3, F: 5, S: 6 };
  const start = dayMap[startDay as keyof typeof dayMap];
  const end = dayMap[endDay as keyof typeof dayMap];

  // Check if current day is within range
  if (currentDay < start || currentDay > end) return false;

  // Check if current hour is within range
  return currentHour >= parseInt(startHour) && currentHour < parseInt(endHour);
}

export function formatBusinessHours(hours: string): string {
  if (!hours || hours === '') return 'Closed';

  if (hours === 'S_S_24') return '24/7';

  const match = hours.match(/^([M|T|W|F|S])_([M|T|W|F|S])_(\d+)_(\d+)$/);
  if (!match) return 'Closed';

  const [, start, end, startHour, endHour] = match;
  const days: Record<string, string> = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    F: 'Friday',
    S: 'Saturday',
  };

  return `${days[start as keyof typeof days]} - ${days[end as keyof typeof days]}, ${startHour}:00 AM - ${endHour}:00 PM`;
}

export function parseBusinessHours(hours: string): BusinessHourDay[] {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  if (hours === 'S_S_24') {
    return days.map((day) => ({
      day,
      isOpen: true,
      openTime: '12:00 AM',
      closeTime: '11:59 PM',
    }));
  }

  const [startDay, endDay, startHour, endHour] = hours.split('_');
  return days.map((day) => {
    const isBusinessDay =
      days.indexOf(day) >= days.indexOf(startDay) &&
      days.indexOf(day) <= days.indexOf(endDay);
    return {
      day,
      isOpen: isBusinessDay,
      openTime: isBusinessDay ? formatHour(startHour) : 'Closed',
      closeTime: isBusinessDay ? formatHour(endHour) : 'Closed',
    };
  });
}

export function generateInteractionId(): string {
  return `MP-${Date.now()}-${Math.random().toString(36).substring(2)}`;
}

function formatHour(hour: string): string {
  const h = parseInt(hour);
  return h === 12
    ? '12:00 PM'
    : h > 12
      ? `${h - 12}:00 PM`
      : h === 0
        ? '12:00 AM'
        : `${h}:00 AM`;
}
