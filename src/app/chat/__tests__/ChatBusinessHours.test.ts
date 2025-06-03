import { isWithinBusinessHours, parseBusinessHours } from '../utils/chatHours';

// Mock the current date for testing
const mockDate = new Date('2023-06-12T14:00:00'); // Monday at 2:00 PM
jest
  .spyOn(global, 'Date')
  .mockImplementation(() => mockDate as unknown as Date);

describe('Chat Business Hours', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('parseBusinessHours', () => {
    it('should correctly parse standard business hours format', () => {
      const result = parseBusinessHours('Mon-Fri: 8:00 AM - 5:00 PM ET');
      expect(result).not.toBeNull();
      if (result) {
        expect(result.daysOfWeek).toContain('Monday');
        expect(result.daysOfWeek).toContain('Friday');
        expect(result.startTime).toBe(8 * 60); // 8:00 AM in minutes
        expect(result.endTime).toBe(17 * 60); // 5:00 PM in minutes
        expect(result.timezone).toBe('ET');
      }
    });

    it('should return null for invalid format', () => {
      const result = parseBusinessHours('invalid_format');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseBusinessHours('');
      expect(result).toBeNull();
    });
  });

  describe('isWithinBusinessHours', () => {
    it('should return true for current time within business hours', () => {
      // Monday at 2:00 PM should be within Mon-Fri: 8:00 AM - 5:00 PM
      expect(isWithinBusinessHours('Mon-Fri: 8:00 AM - 5:00 PM ET')).toBe(true);
    });

    it('should return false for current time outside business hours', () => {
      // Mock after-hours time (8:00 PM)
      const afterHoursMockDate = new Date('2023-06-12T20:00:00'); // Monday at 8:00 PM
      jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => afterHoursMockDate as unknown as Date);

      expect(isWithinBusinessHours('Mon-Fri: 8:00 AM - 5:00 PM ET')).toBe(
        false,
      );
    });

    it('should return false for current day not in business days', () => {
      // Mock weekend day (Saturday)
      const weekendMockDate = new Date('2023-06-10T14:00:00'); // Saturday at 2:00 PM
      jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => weekendMockDate as unknown as Date);

      expect(isWithinBusinessHours('Mon-Fri: 8:00 AM - 5:00 PM ET')).toBe(
        false,
      );
    });

    it('should return false for invalid format', () => {
      // Invalid formats should return false
      expect(isWithinBusinessHours('invalid_format')).toBe(false);
    });
  });
});
