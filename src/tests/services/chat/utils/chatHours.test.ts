import {
  checkChatHours,
  formatBusinessHours,
  getLegacyChatHoursMessage,
  isWithinBusinessHours,
} from '../../../../services/chat/utils/chatHours';
import { BusinessHours } from '../../models/chat';

// Define types for global testing objects to fix TypeScript errors
declare global {
  var jest: any;
  var describe: (name: string, fn: () => void) => void;
  var beforeEach: (fn: () => void) => void;
  var afterEach: (fn: () => void) => void;
  var test: (name: string, fn: () => void) => void;
  var expect: any;
}

// Mock date for consistent testing
const mockDate = (isoDate: string) => {
  const originalDate = global.Date;
  class MockDate extends originalDate {
    constructor(...args: any[]) {
      if (args.length === 0) {
        super(isoDate);
      } else {
        super(...args);
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

describe('Chat Hours Utility', () => {
  // Mock the current date for predictable tests
  const realDate = global.Date;
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date(2023, 0, 2); // Monday, January 2, 2023
    mockDate.setHours(14, 30, 0); // 2:30 PM

    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }

      static now() {
        return mockDate.getTime();
      }
    } as any;
  });

  afterEach(() => {
    global.Date = realDate;
  });

  describe('isWithinBusinessHours', () => {
    it('should return true for 24/7 availability', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: true,
        days: [],
      };

      expect(isWithinBusinessHours(businessHours)).toBe(true);
    });

    it('should return true when current time is within business hours', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(isWithinBusinessHours(businessHours)).toBe(true);
    });

    it('should return false when current time is outside business hours', () => {
      mockDate.setHours(18, 30, 0); // 6:30 PM

      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(isWithinBusinessHours(businessHours)).toBe(false);
    });

    it('should return false when current day is not a business day', () => {
      mockDate = new Date(2023, 0, 1); // Sunday, January 1, 2023
      mockDate.setHours(14, 30, 0); // 2:30 PM

      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(isWithinBusinessHours(businessHours)).toBe(false);
    });
  });

  describe('formatBusinessHours', () => {
    it('should return "24/7" for 24/7 availability', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: true,
        days: [],
      };

      expect(formatBusinessHours(businessHours)).toBe('24/7');
    });

    it('should format weekday business hours correctly', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(formatBusinessHours(businessHours)).toBe(
        'Monday-Friday: 08:00 - 17:00',
      );
    });

    it('should format different hour ranges correctly', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Saturday', openTime: '10:00', closeTime: '15:00' },
          { day: 'Sunday', openTime: '10:00', closeTime: '15:00' },
        ],
      };

      expect(formatBusinessHours(businessHours)).toBe(
        'Monday-Friday: 08:00 - 17:00 | Saturday-Sunday: 10:00 - 15:00',
      );
    });

    it('should use "Daily" when all days have the same hours', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Saturday', openTime: '08:00', closeTime: '20:00' },
          { day: 'Sunday', openTime: '08:00', closeTime: '20:00' },
        ],
      };

      expect(formatBusinessHours(businessHours)).toBe('Daily: 08:00 - 20:00');
    });
  });

  describe('getLegacyChatHoursMessage', () => {
    it('should return availability message when within business hours', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(getLegacyChatHoursMessage(businessHours)).toBe(
        'Chat is currently available',
      );
    });

    it('should return unavailability message when outside business hours', () => {
      mockDate.setHours(18, 30, 0); // 6:30 PM

      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          { day: 'Monday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Tuesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Wednesday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Thursday', openTime: '08:00', closeTime: '17:00' },
          { day: 'Friday', openTime: '08:00', closeTime: '17:00' },
        ],
      };

      expect(getLegacyChatHoursMessage(businessHours)).toBe(
        'Chat is currently unavailable. Please try again during our business hours: Monday-Friday: 08:00 - 17:00',
      );
    });
  });
});
