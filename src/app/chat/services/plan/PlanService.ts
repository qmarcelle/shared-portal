import { BusinessHours, PlanInfo, UserEligibility } from '../models/types';

export class PlanService {
  private currentPlan: PlanInfo | null = null;
  private availablePlans: PlanInfo[] = [];
  private eligibility: UserEligibility;

  constructor(eligibility: UserEligibility) {
    this.eligibility = eligibility;
    this.availablePlans = this.getPlans();
    this.currentPlan =
      this.availablePlans.find((plan) => plan.isEligibleForChat) || null;
  }

  /**
   * Get the current active plan
   */
  getCurrentPlan(): PlanInfo | null {
    return this.currentPlan;
  }

  /**
   * Get all available plans
   */
  getAvailablePlans(): PlanInfo[] {
    return this.availablePlans;
  }

  /**
   * Switch to a different plan
   */
  switchPlan(planId: string): boolean {
    const newPlan = this.availablePlans.find((plan) => plan.id === planId);
    if (!newPlan) {
      return false;
    }

    this.currentPlan = newPlan;
    return true;
  }

  /**
   * Check if a plan is chat eligible
   */
  isPlanChatEligible(planId: string): boolean {
    const plan = this.availablePlans.find((p) => p.id === planId);
    return plan?.isEligibleForChat || false;
  }

  /**
   * Get business hours for a specific plan
   */
  getBusinessHours(planId: string): BusinessHours | null {
    const plan = this.availablePlans.find((p) => p.id === planId);
    return plan?.businessHours ?? null;
  }

  /**
   * Check if a plan is currently within business hours
   */
  isWithinBusinessHours(planId: string): boolean {
    const businessHours = this.getBusinessHours(planId);
    if (!businessHours) {
      return false;
    }

    if (businessHours.isOpen24x7) {
      return true;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const businessDay = businessHours.days.find(
      (day) => day.day === currentDay,
    );
    if (!businessDay) {
      return false;
    }

    return (
      currentTime >= businessDay.openTime &&
      currentTime <= businessDay.closeTime
    );
  }

  /**
   * Get the next opening time for a plan
   */
  getNextOpeningTime(planId: string): string | null {
    const businessHours = this.getBusinessHours(planId);
    if (!businessHours) {
      return null;
    }

    if (businessHours.isOpen24x7) {
      return null;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });

    const businessDay = businessHours.days.find(
      (day) => day.day === currentDay,
    );
    if (!businessDay) {
      return null;
    }

    if (currentTime < businessDay.openTime) {
      return businessDay.openTime;
    }

    if (currentTime > businessDay.closeTime) {
      // Find next open day
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

      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDay = businessHours.days.find(
          (day) => day.day === days[nextDayIndex],
        );
        if (nextDay) {
          return nextDay.openTime;
        }
      }
    }

    return null;
  }

  /**
   * Get terms and conditions for a specific plan
   */
  getTermsAndConditions(planId: string): string | null {
    const plan = this.availablePlans.find((p) => p.id === planId);
    return plan?.termsAndConditions || null;
  }

  /**
   * Update user eligibility for a plan
   */
  updateEligibility(planId: string, eligibility: UserEligibility): void {
    const plan = this.availablePlans.find((p) => p.id === planId);
    if (plan) {
      plan.isEligibleForChat = eligibility.isChatEligibleMember;
    }
  }

  /**
   * Get plans with chat eligibility information
   */
  public getPlans(): PlanInfo[] {
    // In a real implementation, this would fetch from an API
    // For now, we'll create mock data based on the eligibility

    const plans: PlanInfo[] = [
      {
        id: this.eligibility.memberMedicalPlanID || 'default-plan',
        name: 'Medical Plan',
        isEligibleForChat: this.eligibility.isChatEligibleMember,
        businessHours: this.getDefaultBusinessHours(),
        lineOfBusiness: 'Medical',
        termsAndConditions: '',
        isActive: true,
        memberFirstname: this.eligibility.memberFirstname,
        memberLastname: this.eligibility.memberLastName,
        memberId: this.eligibility.memberMedicalPlanID,
        groupId: this.eligibility.groupId,
        lobGroup: this.eligibility.getGroupType,
        isMedicalEligible: this.eligibility.isMedical,
        isDentalEligible: this.eligibility.isDental,
        isVisionEligible: this.eligibility.isVision,
      },
    ];

    return plans;
  }

  /**
   * Get chat eligibility for a specific plan
   */
  public getPlanEligibility(planId: string): boolean {
    const plan = this.getPlans().find((p) => p.id === planId);
    return plan?.isEligibleForChat || false;
  }

  /**
   * Get business hours for the chat service
   */
  private getDefaultBusinessHours(): BusinessHours {
    return {
      isOpen24x7: this.eligibility.chatHours === 'S_S_24',
      days: this.parseBusinessHours(this.eligibility.chatHours),
      timezone: 'America/New_York',
      isCurrentlyOpen: this.eligibility.isChatAvailable,
      lastUpdated: Date.now(),
      source: 'default',
    };
  }

  /**
   * Parse business hours string into structured format
   */
  private parseBusinessHours(hoursStr: string): BusinessHours['days'] {
    // Default business days if parsing fails
    const defaultDays = [
      { day: 'Monday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Tuesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Wednesday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Thursday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Friday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Saturday', openTime: '00:00', closeTime: '00:00', isOpen: false },
      { day: 'Sunday', openTime: '00:00', closeTime: '00:00', isOpen: false },
    ];

    if (!hoursStr || hoursStr === 'S_S_24') {
      // 24/7 availability
      return defaultDays.map((day) => ({
        ...day,
        isOpen: true,
        openTime: '00:00',
        closeTime: '23:59',
      }));
    }

    try {
      // Parse format like "M_F_8_18" (Monday to Friday, 8am to 6pm)
      const parts = hoursStr.split('_');
      if (parts.length < 4) return defaultDays;

      const startDay = this.mapDayCodeToName(parts[0]);
      const endDay = this.mapDayCodeToName(parts[1]);
      const startHour = parts[2].padStart(2, '0') + ':00';
      const endHour = parts[3].padStart(2, '0') + ':00';

      // Set open/close times for days in the range
      return defaultDays.map((day) => {
        const isDayInRange = this.isDayInRange(day.day, startDay, endDay);
        return {
          ...day,
          isOpen: isDayInRange,
          openTime: isDayInRange ? startHour : '00:00',
          closeTime: isDayInRange ? endHour : '00:00',
        };
      });
    } catch (error) {
      console.error('Error parsing business hours:', error);
      return defaultDays;
    }
  }

  /**
   * Map day code to full name
   */
  private mapDayCodeToName(code: string): string {
    const map: Record<string, string> = {
      S: 'Sunday',
      M: 'Monday',
      T: 'Tuesday',
      W: 'Wednesday',
      R: 'Thursday',
      F: 'Friday',
      A: 'Saturday',
    };

    return map[code] || 'Monday';
  }

  /**
   * Check if a day is within a range
   */
  private isDayInRange(day: string, startDay: string, endDay: string): boolean {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayIndex = days.indexOf(day);
    const startIndex = days.indexOf(startDay);
    const endIndex = days.indexOf(endDay);

    if (startIndex <= endIndex) {
      return dayIndex >= startIndex && dayIndex <= endIndex;
    } else {
      // Handle wrap around (e.g., Friday to Monday)
      return dayIndex >= startIndex || dayIndex <= endIndex;
    }
  }
}
