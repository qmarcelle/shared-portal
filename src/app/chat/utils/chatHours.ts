interface BusinessHours {
  daysOfWeek: string[];
  startTime: number;
  endTime: number;
  timezone: string;
}

export function checkChatHours(rawChatHours: string): boolean {
  try {
    const [days, hours] = rawChatHours.split('_');
    const [startTime, endTime] = hours.split('-');
    const currentHour = new Date().getHours();
    const startHour = parseInt(startTime);
    const endHour = parseInt(endTime);
    return currentHour >= startHour && currentHour < endHour;
  } catch {
    return true; // Default to true when parsing fails
  }
}

export function parseBusinessHours(hoursString: string): BusinessHours | null {
  try {
    const [daysRange, timeRange, timezone] = hoursString.split(/[:\s]+/);
    const [startDay, endDay] = daysRange.split('-');
    const [startTime, , endTime] = timeRange.split(/\s+/);

    const daysMap: { [key: string]: string[] } = {
      Mon: ['Monday'],
      Monday: ['Monday'],
      Tue: ['Tuesday'],
      Tuesday: ['Tuesday'],
      Wed: ['Wednesday'],
      Wednesday: ['Wednesday'],
      Thu: ['Thursday'],
      Thursday: ['Thursday'],
      Fri: ['Friday'],
      Friday: ['Friday'],
    };

    const daysOfWeek = [];
    let currentDay = daysMap[startDay][0];
    const endDayFull = daysMap[endDay][0];

    while (currentDay !== endDayFull) {
      daysOfWeek.push(currentDay);
      const index = Object.values(daysMap).findIndex(
        (d) => d[0] === currentDay,
      );
      currentDay = Object.values(daysMap)[index + 1][0];
    }
    daysOfWeek.push(endDayFull);

    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const isPM = time.toLowerCase().includes('pm');
      let hour = parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      return hour * 60 + parseInt(minutes || '0');
    };

    return {
      daysOfWeek,
      startTime: parseTime(startTime),
      endTime: parseTime(endTime),
      timezone: timezone || 'ET',
    };
  } catch {
    return null;
  }
}

export function isWithinBusinessHours(hoursString: string): boolean {
  const hours = parseBusinessHours(hoursString);
  if (!hours) return false;

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();

  return (
    hours.daysOfWeek.includes(currentDay) &&
    currentTime >= hours.startTime &&
    currentTime < hours.endTime
  );
}
