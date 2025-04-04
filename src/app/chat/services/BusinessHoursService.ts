import { BusinessDay, BusinessHours } from '../types';

/**
 * Service for managing business hours
 */
export class BusinessHoursService {
  private static instance: BusinessHoursService;
  private businessHours: BusinessHours | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): BusinessHoursService {
    if (!BusinessHoursService.instance) {
      BusinessHoursService.instance = new BusinessHoursService();
    }
    return BusinessHoursService.instance;
  }

  /**
   * Gets the current business hours
   */
  async getBusinessHours(): Promise<BusinessHours> {
    try {
      const response = await fetch('/api/v1/chat/business-hours', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Business hours check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking business hours:', error);
      // Default to closed if we can't get the hours
      return {
        isOpen24x7: false,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: false,
        lastUpdated: Date.now(),
        source: 'api',
      };
    }
  }

  /**
   * Checks if the current time is within business hours
   */
  async isWithinBusinessHours(): Promise<boolean> {
    const hours = await this.getBusinessHours();
    return hours.isCurrentlyOpen || false;
  }

  /**
   * Gets the next opening time if business is currently closed
   */
  async getNextOpeningTime(): Promise<string | null> {
    const hours = await this.getBusinessHours();

    if (hours.isCurrentlyOpen) {
      return null; // Already open
    }

    return hours.nextOpeningTime || null;
  }

  /**
   * Checks if a specific day and time is within business hours
   */
  isTimeWithinHours(
    day: string,
    hour: number,
    minutes: number,
    businessHours: BusinessHours,
  ): boolean {
    // Find the day in the business hours
    const businessDay = businessHours.days.find(
      (d) => d.day.toLowerCase() === day.toLowerCase(),
    );

    if (!businessDay || !businessDay.isOpen) {
      return false; // Day not found or not open on this day
    }

    // Parse the open/close times
    const [openHour, openMin] = businessDay.openTime.split(':').map(Number);
    const [closeHour, closeMin] = businessDay.closeTime.split(':').map(Number);

    // Convert to minutes for easier comparison
    const timeInMinutes = hour * 60 + minutes;
    const openTimeInMinutes = openHour * 60 + openMin;
    const closeTimeInMinutes = closeHour * 60 + closeMin;

    return (
      timeInMinutes >= openTimeInMinutes && timeInMinutes < closeTimeInMinutes
    );
  }

  /**
   * Check if chat is currently available based on business hours
   */
  public async isChatAvailable(): Promise<boolean> {
    const hours = await this.getBusinessHours();

    if (hours.isOpen24x7) {
      return true;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const businessDay = hours.days.find(
      (day) => day.day === currentDay && !day.isHoliday,
    );

    if (!businessDay || !businessDay.isOpen) {
      return false;
    }

    return (
      currentTime >= businessDay.openTime &&
      currentTime <= businessDay.closeTime
    );
  }

  /**
   * Get a human-readable message about chat availability
   */
  public async getAvailabilityMessage(): Promise<string> {
    const isAvailable = await this.isChatAvailable();

    if (isAvailable) {
      return 'Chat is currently available';
    }

    const nextOpening = await this.getNextOpeningTime();
    if (nextOpening) {
      return `Chat is currently unavailable. We will be open at ${nextOpening}`;
    }

    return 'Chat is currently unavailable. Please check back later.';
  }

  /**
   * Get default business hours as fallback
   */
  private getDefaultBusinessHours(): BusinessHours {
    const defaultDays: BusinessDay[] = [
      { day: 'Monday', openTime: '08:00', closeTime: '17:00', isOpen: true },
      { day: 'Tuesday', openTime: '08:00', closeTime: '17:00', isOpen: true },
      { day: 'Wednesday', openTime: '08:00', closeTime: '17:00', isOpen: true },
      { day: 'Thursday', openTime: '08:00', closeTime: '17:00', isOpen: true },
      { day: 'Friday', openTime: '08:00', closeTime: '17:00', isOpen: true },
      { day: 'Saturday', openTime: '00:00', closeTime: '00:00', isOpen: false },
      { day: 'Sunday', openTime: '00:00', closeTime: '00:00', isOpen: false },
    ];

    return {
      isOpen24x7: false,
      days: defaultDays,
      timezone: 'America/New_York',
      isCurrentlyOpen: false,
      lastUpdated: Date.now(),
      source: 'default',
    };
  }
}
