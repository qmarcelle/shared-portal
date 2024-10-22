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
