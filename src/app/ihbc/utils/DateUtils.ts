import { format, parse } from 'date-fns';
import { BenefitServiceException } from '../models/BenefitServiceException';
import { DATE_FORMAT } from './ApplicationConstants';

export const convertDateToString = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

export const convertStringToDate = (str: string): Date => {
  let result = convertStringToDateWithPattern(str, DATE_FORMAT);

  if (result === null) {
    result = convertStringToDateWithPattern(str, 'yyyy-MM-dd HH:mm:ss.SSS');
  }

  return result;
};

export const convertStringToDateWithPattern = (
  str: string,
  pattern: string,
): Date => {
  if (!str || str.trim().length === 0) {
    throw new BenefitServiceException('Date string is empty');
  }
  try {
    return parse(str, pattern, new Date());
  } catch (e) {
    console.error(`ParseException occurred for: ${str}`, e);
    throw new BenefitServiceException(`ParseException occurred for: ${str}`);
  }
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export function getAge(dateOfBirth: string, effDate?: string): number {
  const date = new Date(dateOfBirth);
  const today = effDate ? new Date(effDate) : new Date();
  let age = today.getFullYear() - date.getFullYear();
  if (
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  ) {
    age--;
  }
  return age;
}

export function getAgeFromDate(dateOfBirth?: Date, effDate?: Date): number {
  if (!dateOfBirth) {
    throw new BenefitServiceException('Date of Birth is required');
  }
  const date = new Date(dateOfBirth);
  const today = effDate ? new Date(effDate) : new Date();
  let age = today.getFullYear() - date.getFullYear();
  if (
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  ) {
    age--;
  }
  return age;
}

export function firstDayOfNextMonth(date: Date): Date {
  const eventDateObj = new Date(date);
  return new Date(eventDateObj.getFullYear(), eventDateObj.getMonth() + 1, 1);
}
