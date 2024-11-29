export const UNIXTimeSeconds = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * Formats the Date object to mm/dd/yyyy format
 * @param date The date to format
 */
export const formatDateToLocale = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formats the Date object to mm-dd-yyyy format
 * @param date The date to format
 */
export const formatDateToIntlLocale = (date: Date) => {
  return formatDateToLocale(date).replace(/\//g, '-');
};

export const getDateTwoYearsAgoFormatted = () => {
  const today = new Date();
  return formatDateToIntlLocale(
    new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
  );
};

/**
 * Computes the difference in days between two dates.
 * A positive value means date 1 is ahead or else date2 is ahead.
 * @param date1 First date
 * @param date2 Second Date
 * @returns Difference in days between two dates
 */
export function getDifferenceInDays(date1: Date, date2: Date) {
  const diffInMs = +date1 - +date2; // Get difference in milliseconds
  const millisecondsPerDay = 1000 * 60 * 60 * 24; // Calculate milliseconds in a day

  return Math.floor(diffInMs / millisecondsPerDay); // Calculate and round down to the nearest whole number
}
