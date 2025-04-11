import {
  checkChatHours,
  isWithinBusinessHours,
  parseBusinessHours,
} from '@/app/chat/utils/chatHours';
import { afterEach, describe, expect, jest, test } from '@jest/globals';

// Mock date for consistent testing
const mockDate = (isoDate: string) => {
  const originalDate = global.Date;
  class MockDate extends originalDate {
    constructor(value?: string | number | Date) {
      if (!value) {
        super(isoDate);
      } else {
        super(value);
      }
    }

    static now() {
      return new originalDate(isoDate).getTime();
    }
  }

  global.Date = MockDate as DateConstructor;
  return () => {
    global.Date = originalDate;
  };
};

describe('checkChatHours', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return true when current time is before end time (AM)', () => {
    const cleanup = mockDate('2023-01-01T10:30:00-05:00'); // 10:30 AM EST
    const rawChatHours = 'Monday-Friday_8:00am-5:00pm_17.00';

    const result = checkChatHours(rawChatHours);

    expect(result).toBe(true);
    cleanup();
  });

  test('should return true when current time is before end time (PM)', () => {
    const cleanup = mockDate('2023-01-01T16:45:00-05:00'); // 4:45 PM EST
    const rawChatHours = 'Monday-Friday_8:00am-5:00pm_17.00';

    const result = checkChatHours(rawChatHours);

    expect(result).toBe(true);
    cleanup();
  });

  test('should return false when current time is after end time', () => {
    const cleanup = mockDate('2023-01-01T17:15:00-05:00'); // 5:15 PM EST
    const rawChatHours = 'Monday-Friday_8:00am-5:00pm_17.00';

    const result = checkChatHours(rawChatHours);

    expect(result).toBe(false);
    cleanup();
  });

  test('should handle PM hours correctly by adding 12', () => {
    const cleanup = mockDate('2023-01-01T13:30:00-05:00'); // 1:30 PM EST
    const rawChatHours = 'Monday-Friday_8:00am-3:00pm_3.00';

    const result = checkChatHours(rawChatHours);

    expect(result).toBe(true);
    cleanup();
  });

  test('should handle malformed input gracefully', () => {
    const cleanup = mockDate('2023-01-01T12:00:00-05:00'); // 12:00 PM EST
    const rawChatHours = 'Monday-Friday_8:00am-5:00pm';

    const result = checkChatHours(rawChatHours);

    expect(result).toBe(true); // Default to true when parsing fails
    cleanup();
  });
});

describe('Chat Hours Utilities', () => {
  describe('parseBusinessHours', () => {
    it('parses business hours string correctly', () => {
      const result = parseBusinessHours('Monday-Friday: 8:00 AM - 6:00 PM ET');

      expect(result).toEqual({
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: 8 * 60, // 8:00 AM in minutes
        endTime: 18 * 60, // 6:00 PM in minutes
        timezone: 'ET',
      });
    });

    it('handles different time formats', () => {
      const result = parseBusinessHours('Mon-Wed: 9:30 AM - 5:45 PM CT');

      expect(result).toEqual({
        daysOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
        startTime: 9 * 60 + 30, // 9:30 AM in minutes
        endTime: 17 * 60 + 45, // 5:45 PM in minutes
        timezone: 'CT',
      });
    });

    it('returns null for invalid formats', () => {
      const result = parseBusinessHours('Invalid format');
      expect(result).toBeNull();
    });
  });

  describe('isWithinBusinessHours', () => {
    // Mock date for testing
    const mockDate = new Date('2023-06-15T14:30:00Z'); // Thursday 2:30 PM UTC

    beforeAll(() => {
      // Mock Date.now
      const originalNow = Date.now;
      jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

      return () => {
        // Restore original Date.now
        (Date.now as jest.Mock).mockImplementation(originalNow);
      };
    });

    it('returns true when current time is within business hours', () => {
      const result = isWithinBusinessHours(
        'Monday-Friday: 8:00 AM - 6:00 PM ET',
      );
      expect(result).toBe(true);
    });

    it('returns false when current time is outside business hours', () => {
      const result = isWithinBusinessHours(
        'Monday-Friday: 9:00 AM - 12:00 PM ET',
      );
      expect(result).toBe(false);
    });

    it('returns false for invalid business hours format', () => {
      const result = isWithinBusinessHours('Invalid format');
      expect(result).toBe(false);
    });
  });
});
