import { ChatPlan, UserEligibility } from '../../models/types';
import { PlanService } from '../PlanService';

describe('PlanService', () => {
  let mockPlans: ChatPlan[];
  let planService: PlanService;

  beforeEach(() => {
    mockPlans = [
      {
        id: 'plan-1',
        name: 'Plan 1',
        isActive: true,
        isChatEligible: true,
        lineOfBusiness: 'medical',
        businessHours: {
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
          ],
          timezone: 'America/New_York',
          isCurrentlyOpen: true,
        },
        termsAndConditions: 'Terms for Plan 1',
      },
      {
        id: 'plan-2',
        name: 'Plan 2',
        isActive: false,
        isChatEligible: false,
        lineOfBusiness: 'dental',
        businessHours: {
          isOpen24x7: true,
          days: [],
          timezone: 'America/New_York',
          isCurrentlyOpen: true,
        },
        termsAndConditions: 'Terms for Plan 2',
      },
    ];

    planService = new PlanService(mockPlans);
  });

  describe('getCurrentPlan', () => {
    it('should return the current active plan', () => {
      const currentPlan = planService.getCurrentPlan();
      expect(currentPlan).toEqual(mockPlans[0]);
    });

    it('should return null if no active plan', () => {
      const service = new PlanService([]);
      expect(service.getCurrentPlan()).toBeNull();
    });
  });

  describe('getAvailablePlans', () => {
    it('should return all available plans', () => {
      const availablePlans = planService.getAvailablePlans();
      expect(availablePlans).toEqual(mockPlans);
    });

    it('should return empty array if no plans', () => {
      const service = new PlanService([]);
      expect(service.getAvailablePlans()).toEqual([]);
    });
  });

  describe('switchPlan', () => {
    it('should switch to a valid plan', () => {
      const result = planService.switchPlan('plan-2');
      expect(result).toBe(true);
      expect(planService.getCurrentPlan()).toEqual(mockPlans[1]);
    });

    it('should not switch to an invalid plan', () => {
      const result = planService.switchPlan('invalid-plan');
      expect(result).toBe(false);
      expect(planService.getCurrentPlan()).toEqual(mockPlans[0]);
    });
  });

  describe('isPlanChatEligible', () => {
    it('should return true for eligible plan', () => {
      expect(planService.isPlanChatEligible('plan-1')).toBe(true);
    });

    it('should return false for ineligible plan', () => {
      expect(planService.isPlanChatEligible('plan-2')).toBe(false);
    });

    it('should return false for invalid plan', () => {
      expect(planService.isPlanChatEligible('invalid-plan')).toBe(false);
    });
  });

  describe('getBusinessHours', () => {
    it('should return business hours for valid plan', () => {
      const hours = planService.getBusinessHours('plan-1');
      expect(hours).toEqual(mockPlans[0].businessHours);
    });

    it('should return null for invalid plan', () => {
      const hours = planService.getBusinessHours('invalid-plan');
      expect(hours).toBeNull();
    });
  });

  describe('isWithinBusinessHours', () => {
    it('should return true for 24/7 plan', () => {
      expect(planService.isWithinBusinessHours('plan-2')).toBe(true);
    });

    it('should return false for invalid plan', () => {
      expect(planService.isWithinBusinessHours('invalid-plan')).toBe(false);
    });

    it('should return true when within business hours', () => {
      // Mock current time to be within business hours
      const mockDate = new Date('2024-01-01T10:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(planService.isWithinBusinessHours('plan-1')).toBe(true);
    });

    it('should return false when outside business hours', () => {
      // Mock current time to be outside business hours
      const mockDate = new Date('2024-01-01T18:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(planService.isWithinBusinessHours('plan-1')).toBe(false);
    });
  });

  describe('getNextOpeningTime', () => {
    it('should return null for 24/7 plan', () => {
      expect(planService.getNextOpeningTime('plan-2')).toBeNull();
    });

    it('should return null for invalid plan', () => {
      expect(planService.getNextOpeningTime('invalid-plan')).toBeNull();
    });

    it('should return opening time when before business hours', () => {
      // Mock current time to be before business hours
      const mockDate = new Date('2024-01-01T08:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(planService.getNextOpeningTime('plan-1')).toBe('09:00');
    });

    it('should return next day opening time when after business hours', () => {
      // Mock current time to be after business hours
      const mockDate = new Date('2024-01-01T18:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(planService.getNextOpeningTime('plan-1')).toBe('09:00');
    });

    it('should return null when within business hours', () => {
      // Mock current time to be within business hours
      const mockDate = new Date('2024-01-01T10:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      expect(planService.getNextOpeningTime('plan-1')).toBeNull();
    });
  });

  describe('getTermsAndConditions', () => {
    it('should return terms for valid plan', () => {
      expect(planService.getTermsAndConditions('plan-1')).toBe(
        'Terms for Plan 1',
      );
    });

    it('should return null for invalid plan', () => {
      expect(planService.getTermsAndConditions('invalid-plan')).toBeNull();
    });
  });

  describe('updateEligibility', () => {
    it('should update eligibility for valid plan', () => {
      const newEligibility: UserEligibility = {
        isChatEligibleMember: true,
        isDemoMember: false,
        isAmplifyMem: false,
        groupId: 'test-group',
        memberClientID: 'test-client',
        getGroupType: 'test-type',
        isBlueEliteGroup: false,
        isMedical: true,
        isDental: false,
        isVision: false,
        isWellnessOnly: false,
        isCobraEligible: false,
        chatHours: 'M_F_8_6',
        rawChatHours: 'M_F_8_6',
        isChatbotEligible: true,
        memberMedicalPlanID: 'test-plan',
        isIDCardEligible: true,
        memberDOB: '1990-01-01',
        subscriberID: 'test-subscriber',
        sfx: 'test-sfx',
        memberFirstname: 'John',
        memberLastName: 'Doe',
        userID: 'test-user',
        isChatAvailable: true,
        routingchatbotEligible: true,
      };

      planService.updateEligibility('plan-1', newEligibility);
      expect(planService.isPlanChatEligible('plan-1')).toBe(true);
    });

    it('should not update eligibility for invalid plan', () => {
      const newEligibility: UserEligibility = {
        isChatEligibleMember: true,
        isDemoMember: false,
        isAmplifyMem: false,
        groupId: 'test-group',
        memberClientID: 'test-client',
        getGroupType: 'test-type',
        isBlueEliteGroup: false,
        isMedical: true,
        isDental: false,
        isVision: false,
        isWellnessOnly: false,
        isCobraEligible: false,
        chatHours: 'M_F_8_6',
        rawChatHours: 'M_F_8_6',
        isChatbotEligible: true,
        memberMedicalPlanID: 'test-plan',
        isIDCardEligible: true,
        memberDOB: '1990-01-01',
        subscriberID: 'test-subscriber',
        sfx: 'test-sfx',
        memberFirstname: 'John',
        memberLastName: 'Doe',
        userID: 'test-user',
        isChatAvailable: true,
        routingchatbotEligible: true,
      };

      planService.updateEligibility('invalid-plan', newEligibility);
      // No change should occur
      expect(planService.getAvailablePlans().length).toBe(2);
    });
  });
});
