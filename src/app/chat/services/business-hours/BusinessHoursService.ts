import { ChatError } from '../../types/errors';
import { BusinessHours } from '../../types/types';

export class BusinessHoursService {
  private currentHours: BusinessHours | null = null;

  constructor(initialHours?: BusinessHours) {
    this.currentHours = initialHours || null;
  }

  /**
   * Get the current business hours
   */
  getCurrentHours(): BusinessHours | null {
    return this.currentHours;
  }

  /**
   * Update business hours
   */
  updateHours(hours: BusinessHours): void {
    this.currentHours = hours;
  }

  /**
   * Check if current time is within business hours
   */
  isWithinBusinessHours(): boolean {
    if (!this.currentHours) {
      return false;
    }

    if (this.currentHours.isOpen24x7) {
      return true;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const businessDay = this.currentHours.days.find(
      (day) => day.day === currentDay,
    );
    if (!businessDay) {
      return false;
    }

    return (
      businessDay.isOpen &&
      currentTime >= businessDay.openTime &&
      currentTime <= businessDay.closeTime
    );
  }

  /**
   * Get the next opening time
   */
  getNextOpeningTime(): string | null {
    if (!this.currentHours) {
      return null;
    }

    if (this.currentHours.isOpen24x7) {
      return null;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDayIndex = days.indexOf(currentDay);

    // Check current day first
    const todayHours = this.currentHours.days.find(
      (day) => day.day === currentDay,
    );
    if (todayHours && todayHours.isOpen && currentTime < todayHours.openTime) {
      return todayHours.openTime;
    }

    // Check next 7 days
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = this.currentHours.days.find(
        (day) => day.day === days[nextDayIndex],
      );
      if (nextDay && nextDay.isOpen) {
        return nextDay.openTime;
      }
    }

    throw new ChatError(
      'No upcoming business hours found',
      'HOURS_CHECK_FAILED',
      'warning',
    );
  }

  /**
   * Format business hours for display
   */
  formatBusinessHours(): string {
    if (!this.currentHours) {
      return 'Business hours not available';
    }

    if (this.currentHours.isOpen24x7) {
      return 'Open 24/7';
    }

    return this.currentHours.days
      .filter((day) => day.isOpen)
      .map(
        (day) =>
          `${day.day}: ${this.formatTime(day.openTime)} - ${this.formatTime(
            day.closeTime,
          )}`,
      )
      .join('\n');
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }
}
