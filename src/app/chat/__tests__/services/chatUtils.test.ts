import {
  formatBusinessHours,
  generateInteractionId,
  isWithinBusinessHours,
  parseBusinessHours,
} from '@/app/chat/utils/chatUtils';
import { describe, expect, it, jest } from '@jest/globals';

// Mock the console.error to avoid polluting the test output
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock Date for consistent testing
const mockDate = (dateString: string) => {
  const date = new Date(dateString);
  return jest.spyOn(global, 'Date').mockImplementation(() => date);
};

describe('chatUtils', () => {
  describe('isWithinBusinessHours', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true for 24/7 availability', () => {
      const result = isWithinBusinessHours('S_S_24');
      expect(result).toBe(true);
    });

    it('should handle empty or invalid inputs', () => {
      expect(isWithinBusinessHours('')).toBe(false);
      expect(isWithinBusinessHours('invalid')).toBe(false);
    });

    it('should detect business hours availability for M-F 8-6', () => {
      // Tuesday at 10am (during business hours)
      const mockDateTuesday = mockDate('2023-05-09T10:00:00');

      const result = isWithinBusinessHours('M_F_8_6');
      expect(result).toBe(true);

      mockDateTuesday.mockRestore();
    });

    it('should detect outside business hours for M-F 8-6', () => {
      // Saturday at 10am (outside business hours)
      const mockDateSaturday = mockDate('2023-05-13T10:00:00');

      const result = isWithinBusinessHours('M_F_8_6');
      expect(result).toBe(false);

      mockDateSaturday.mockRestore();
    });

    it('should detect outside business hours during evening hours', () => {
      // Tuesday at 7pm (outside 8am-6pm hours)
      const mockDateEvening = mockDate('2023-05-09T19:00:00');

      const result = isWithinBusinessHours('M_F_8_6');
      expect(result).toBe(false);

      mockDateEvening.mockRestore();
    });
  });

  describe('formatBusinessHours', () => {
    it('should format 24/7 availability', () => {
      const result = formatBusinessHours('S_S_24');
      expect(result).toBe('24/7');
    });

    it('should format weekday business hours', () => {
      const result = formatBusinessHours('M_F_8_6');
      expect(result).toBe('Monday - Friday, 8:00 AM - 6:00 PM');
    });

    it('should handle empty or invalid inputs', () => {
      expect(formatBusinessHours('')).toBe('Closed');
      expect(formatBusinessHours('invalid')).toBe('Closed');
    });
  });

  describe('parseBusinessHours', () => {
    it('should parse 24/7 availability', () => {
      const result = parseBusinessHours('S_S_24');
      expect(result.every((day) => day.isOpen)).toBe(true);
      expect(result.every((day) => day.openTime === '12:00 AM')).toBe(true);
      expect(result.every((day) => day.closeTime === '11:59 PM')).toBe(true);
    });

    it('should parse M-F 8-6 schedule', () => {
      const result = parseBusinessHours('M_F_8_6');
      const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const weekends = ['Saturday', 'Sunday'];

      weekdays.forEach((day) => {
        const dayConfig = result.find((d) => d.day === day);
        expect(dayConfig?.isOpen).toBe(true);
        expect(dayConfig?.openTime).toBe('8:00 AM');
        expect(dayConfig?.closeTime).toBe('6:00 PM');
      });

      weekends.forEach((day) => {
        const dayConfig = result.find((d) => d.day === day);
        expect(dayConfig?.isOpen).toBe(false);
        expect(dayConfig?.openTime).toBe('Closed');
        expect(dayConfig?.closeTime).toBe('Closed');
      });
    });
  });

  describe('generateInteractionId', () => {
    it('should generate a unique ID with the correct format', () => {
      const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      const mockRandom = jest
        .spyOn(Math, 'random')
        .mockReturnValue(0.123456789);

      const result = generateInteractionId();

      expect(result).toMatch(/^MP-\d+-[a-z0-9]+$/);
      expect(result).toContain('MP-1234567890-');

      mockDateNow.mockRestore();
      mockRandom.mockRestore();
    });
  });
});
