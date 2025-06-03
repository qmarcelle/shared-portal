import { NO, YES } from '@/utils/api/benefitChangeService';

export const convertToBoolean = (value: string): boolean => {
  return ['true', 'yes'].includes(value.toLowerCase());
};

export const convertToString = (bool: boolean): string => {
  return bool ? YES : NO;
};

export const convertFloatToString = (rate: number): string => {
  return rate.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
