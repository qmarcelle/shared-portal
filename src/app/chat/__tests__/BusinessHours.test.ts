import { calculateIsBusinessHoursOpen, formatBusinessHours } from '../utils/businessHours';

describe('BusinessHours', () => {
  // Store original Date
  const OriginalDate = global.Date;
  
  // Mock the Date object to control time for testing
  const mockDate = (date: Date) => {
    global.Date = class extends Date {
      constructor() {
        super();
        return date;
      }
    } as any;
  };

  afterEach(() => {
    // Restore original Date after each test
    global.Date = OriginalDate;
  });

  it('should return true for 24/7 availability', () => {
    expect(calculateIsBusinessHoursOpen('S_S_24')).toBe(true);
  });

  it('should return false for empty or invalid business hours', () => {
    expect(calculateIsBusinessHoursOpen('')).toBe(false);
    expect(calculateIsBusinessHoursOpen(undefined)).toBe(false);
    expect(calculateIsBusinessHoursOpen('invalid_format')).toBe(false);
  });

  it('should correctly determine if within business hours - weekday during hours', () => {
    // Set to Monday (day 1) at 10 AM
    mockDate(new Date(2023, 0, 2, 10, 0, 0));
    
    expect(calculateIsBusinessHoursOpen('M_F_8_17')).toBe(true);
  });

  it('should correctly determine if outside business hours - weekday before hours', () => {
    // Set to Monday (day 1) at 7 AM
    mockDate(new Date(2023, 0, 2, 7, 0, 0));
    
    expect(calculateIsBusinessHoursOpen('M_F_8_17')).toBe(false);
  });

  it('should correctly determine if outside business hours - weekend', () => {
    // Set to Saturday (day 6)
    mockDate(new Date(2023, 0, 7, 10, 0, 0));
    
    expect(calculateIsBusinessHoursOpen('M_F_8_17')).toBe(false);
  });

  it('should correctly format 24/7 business hours', () => {
    expect(formatBusinessHours('S_S_24')).toBe('24/7 support available');
  });

  it('should correctly format regular business hours', () => {
    expect(formatBusinessHours('M_F_8_17')).toBe('Monday - Friday, 8 AM - 5 PM');
  });

  it('should handle invalid format for display', () => {
    expect(formatBusinessHours('invalid')).toBe('Hours format error');
    expect(formatBusinessHours('')).toBe('Hours unavailable');
  });
});