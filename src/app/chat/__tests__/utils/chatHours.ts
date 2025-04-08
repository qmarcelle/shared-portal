import { BusinessDay, BusinessHours } from '../../types';

export const createMockBusinessHours = (
  overrides: Partial<BusinessHours> = {},
): BusinessHours => ({
  isOpen24x7: false,
  days: [
    {
      day: 'Monday',
      openTime: '09:00',
      closeTime: '17:00',
      isOpen: true,
    },
    {
      day: 'Tuesday',
      openTime: '09:00',
      closeTime: '17:00',
      isOpen: true,
    },
    {
      day: 'Wednesday',
      openTime: '09:00',
      closeTime: '17:00',
      isOpen: true,
    },
    {
      day: 'Thursday',
      openTime: '09:00',
      closeTime: '17:00',
      isOpen: true,
    },
    {
      day: 'Friday',
      openTime: '09:00',
      closeTime: '17:00',
      isOpen: true,
    },
  ],
  timezone: 'America/New_York',
  isCurrentlyOpen: true,
  lastUpdated: Date.now(),
  source: 'api',
  ...overrides,
});

export const createMockBusinessDay = (
  overrides: Partial<BusinessDay> = {},
): BusinessDay => ({
  day: 'Monday',
  openTime: '09:00',
  closeTime: '17:00',
  isOpen: true,
  ...overrides,
});

export const mockBusinessHoursCheck = jest.fn().mockReturnValue(true);
export const mockFormatBusinessHours = jest
  .fn()
  .mockReturnValue('Monday - Friday, 9:00 AM - 5:00 PM');
