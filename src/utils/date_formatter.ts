import { format, parse } from 'date-fns';

export const UNIXTimeSeconds = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * Formats the Date object to given format
 * @param date The date to format
 */
export const formatDateToGiven = (
  date?: Date,
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined,
  day?: 'numeric' | '2-digit' | undefined,
  year?: 'numeric' | '2-digit' | undefined,
  hour?: 'numeric' | '2-digit' | undefined,
  minute?: 'numeric' | '2-digit' | undefined,
  second?: 'numeric' | '2-digit' | undefined,
  timeZoneName?:
    | 'long'
    | 'short'
    | 'shortOffset'
    | 'longOffset'
    | 'shortGeneric'
    | 'longGeneric'
    | undefined,
) => {
  return (date ?? new Date()).toLocaleDateString('en-US', {
    day,
    month,
    year,
    hour,
    minute,
    second,
    timeZoneName,
  });
};

/**
 * Formats the Date object to mm/dd/yyyy format
 * @param date The date to format
 */
export const formatDateToLocale = (date: Date) => {
  return formatDateToGiven(date, '2-digit', '2-digit', 'numeric');
};

/**
 * Formats the Date object to mm-dd-yyyy format
 * @param date The date to format
 */
export const formatDateToIntlLocale = (date: Date) => {
  return formatDateToLocale(date).replace(/\//g, '-');
};

/**
 * Formats the Date string to format given as input
 * @param date Date should be in string format
 * @param inputPattern Date format of an input date as a string
 * @param outputPattern Expected Date format as a string
 * @returns Convert the Date into expected format and send it as string
 */
export const formatDateString = (
  date: string,
  inputPattern: string,
  outputPattern: string,
): string => {
  const parsedDate = parse(date, inputPattern, new Date());
  return format(parsedDate, outputPattern);
};

export const getDateTwoYearsAgoFormatted = () => {
  const today = new Date();
  return formatDateToIntlLocale(
    new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()),
  );
};

export const getDateTwoYearsAgoLocale = () => {
  const today = new Date();
  return formatDateToLocale(
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
