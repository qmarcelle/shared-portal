import { describe, expect, it, jest } from '@jest/globals';
import {
  formatBusinessHours,
  generateInteractionId,
  getChatAvailabilityMessage,
  interpretWorkingHours,
} from '../../utils/chatUtils';

// Mock the console.error to avoid polluting the test output
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock Date for consistent testing
const mockDate = (dateString: string) => {
  const date = new Date(dateString);
  return jest.spyOn(global, 'Date').mockImplementation(() => date);
};

describe('chatUtils', () => {
  describe('interpretWorkingHours', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return is24Hours=true for 24/7 availability', () => {
      const result = interpretWorkingHours('S_S_24');
      expect(result).toEqual({ isAvailable: true, is24Hours: true });
    });

    it('should handle empty or invalid inputs', () => {
      expect(interpretWorkingHours('')).toEqual({ isAvailable: false });
      expect(interpretWorkingHours('invalid')).toEqual({ isAvailable: false });
    });

    it('should detect business hours availability for M-F 8-6', () => {
      // Tuesday at 10am (during business hours)
      const mockDateTuesday = mockDate('2023-05-09T10:00:00');

      const result = interpretWorkingHours('M_F_8_18');
      expect(result).toEqual({ isAvailable: true });

      mockDateTuesday.mockRestore();
    });

    it('should detect outside business hours for M-F 8-6', () => {
      // Saturday at 10am (outside business hours)
      const mockDateSaturday = mockDate('2023-05-13T10:00:00');

      const result = interpretWorkingHours('M_F_8_18');
      expect(result).toEqual({ isAvailable: false });

      mockDateSaturday.mockRestore();
    });

    it('should detect outside business hours during evening hours', () => {
      // Tuesday at 7pm (outside 8am-6pm hours)
      const mockDateEvening = mockDate('2023-05-09T19:00:00');

      const result = interpretWorkingHours('M_F_8_18');
      expect(result).toEqual({ isAvailable: false });

      mockDateEvening.mockRestore();
    });
  });

  describe('formatBusinessHours', () => {
    it('should format 24/7 availability', () => {
      const result = formatBusinessHours('S_S_24');
      expect(result).toBe('Available 24/7');
    });

    it('should format weekday business hours', () => {
      const result = formatBusinessHours('M_F_8_18');
      expect(result).toBe('Monday - Friday, 8 AM - 6 PM');
    });

    it('should handle empty or invalid inputs', () => {
      expect(formatBusinessHours('')).toBe('Hours not available');
      expect(formatBusinessHours('invalid')).toBe('Hours not available');
    });
  });

  describe('getChatAvailabilityMessage', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return availability message when chat is available', () => {
      // Mock Date to be within business hours
      const mockDateTuesday = mockDate('2023-05-09T10:00:00');

      const result = getChatAvailabilityMessage('M_F_8_18');
      expect(result).toBe('Chat is currently available');

      mockDateTuesday.mockRestore();
    });

    it('should return unavailability message with formatted hours', () => {
      // Mock Date to be outside business hours
      const mockDateSaturday = mockDate('2023-05-13T22:00:00');

      const result = getChatAvailabilityMessage('M_F_8_18');
      expect(result).toContain('Chat is currently unavailable');
      expect(result).toContain('Please try again during our business hours');

      mockDateSaturday.mockRestore();
    });
  });

  describe('generateInteractionId', () => {
    it('should generate a unique ID with the correct format', () => {
      const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890);
      const mockRandom = jest
        .spyOn(Math, 'random')
        .mockReturnValue(0.123456789);

      const result = generateInteractionId();

      expect(result).toMatch(/^interaction-\d+-[a-z0-9]+$/);
      expect(result).toContain('interaction-1234567890-');

      mockDateNow.mockRestore();
      mockRandom.mockRestore();
    });
  });
});
