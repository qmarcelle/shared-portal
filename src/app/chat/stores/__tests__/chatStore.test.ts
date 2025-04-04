import { create, StoreApi } from 'zustand';
import {
  BusinessHours,
  ChatError,
  ChatPlan,
  ChatState,
  UserEligibility,
} from '../../models/types';

// Define the store type that includes both state and actions
interface ChatStore extends ChatState {
  setActive: (isActive: boolean) => void;
  setPlanSwitchingLocked: (isLocked: boolean) => void;
  setCurrentPlan: (plan: ChatPlan | null) => void;
  setAvailablePlans: (plans: ChatPlan[]) => void;
  setBusinessHours: (hours: BusinessHours) => void;
  setEligibility: (eligibility: UserEligibility) => void;
  setError: (error: ChatError | null) => void;
}

// Mock the store
jest.mock('../chatStore', () => ({
  useChatStore: jest.fn(),
}));

describe('Chat Store', () => {
  let store: StoreApi<ChatStore>;

  beforeEach(() => {
    store = create<ChatStore>((set) => ({
      isActive: false,
      isPlanSwitchingLocked: false,
      currentPlan: null,
      availablePlans: [],
      businessHours: {
        isOpen24x7: false,
        days: [],
        timezone: 'UTC',
        isCurrentlyOpen: false,
      },
      eligibility: {
        isChatEligibleMember: false,
        isDemoMember: false,
        isAmplifyMem: false,
        groupId: '',
        memberClientID: '',
        getGroupType: '',
        isBlueEliteGroup: false,
        isMedical: false,
        isDental: false,
        isVision: false,
        isWellnessOnly: false,
        isCobraEligible: false,
        chatHours: '',
        rawChatHours: '',
        isChatbotEligible: false,
        memberMedicalPlanID: '',
        isIDCardEligible: false,
        memberDOB: '',
        subscriberID: '',
        sfx: '',
        memberFirstname: '',
        memberLastName: '',
        userID: '',
        isChatAvailable: false,
        routingchatbotEligible: false,
      },
      error: null,
      setActive: (isActive: boolean) => set({ isActive }),
      setPlanSwitchingLocked: (isLocked: boolean) =>
        set({ isPlanSwitchingLocked: isLocked }),
      setCurrentPlan: (plan: ChatPlan | null) => set({ currentPlan: plan }),
      setAvailablePlans: (plans: ChatPlan[]) => set({ availablePlans: plans }),
      setBusinessHours: (hours: BusinessHours) => set({ businessHours: hours }),
      setEligibility: (eligibility: UserEligibility) => set({ eligibility }),
      setError: (error: ChatError | null) => set({ error }),
    }));
  });

  describe('State Management', () => {
    it('initializes with correct default values', () => {
      const state = store.getState();

      expect(state.isActive).toBe(false);
      expect(state.isPlanSwitchingLocked).toBe(false);
      expect(state.currentPlan).toBeNull();
      expect(state.availablePlans).toHaveLength(0);
      expect(state.businessHours.isOpen24x7).toBe(false);
      expect(state.businessHours.days).toHaveLength(0);
      expect(state.businessHours.timezone).toBe('UTC');
      expect(state.businessHours.isCurrentlyOpen).toBe(false);
      expect(state.eligibility.isChatEligibleMember).toBe(false);
      expect(state.eligibility.isDemoMember).toBe(false);
      expect(state.eligibility.isAmplifyMem).toBe(false);
      expect(state.eligibility.groupId).toBe('');
      expect(state.eligibility.memberClientID).toBe('');
      expect(state.eligibility.getGroupType).toBe('');
      expect(state.eligibility.isBlueEliteGroup).toBe(false);
      expect(state.eligibility.isMedical).toBe(false);
      expect(state.eligibility.isDental).toBe(false);
      expect(state.eligibility.isVision).toBe(false);
      expect(state.eligibility.isWellnessOnly).toBe(false);
      expect(state.eligibility.isCobraEligible).toBe(false);
      expect(state.eligibility.chatHours).toBe('');
      expect(state.eligibility.rawChatHours).toBe('');
      expect(state.eligibility.isChatbotEligible).toBe(false);
      expect(state.eligibility.memberMedicalPlanID).toBe('');
      expect(state.eligibility.isIDCardEligible).toBe(false);
      expect(state.eligibility.memberDOB).toBe('');
      expect(state.eligibility.subscriberID).toBe('');
      expect(state.eligibility.sfx).toBe('');
      expect(state.eligibility.memberFirstname).toBe('');
      expect(state.eligibility.memberLastName).toBe('');
      expect(state.eligibility.userID).toBe('');
      expect(state.eligibility.isChatAvailable).toBe(false);
      expect(state.eligibility.routingchatbotEligible).toBe(false);
      expect(state.error).toBeNull();
    });

    it('updates isActive state correctly', () => {
      store.getState().setActive(true);
      expect(store.getState().isActive).toBe(true);

      store.getState().setActive(false);
      expect(store.getState().isActive).toBe(false);
    });

    it('updates isPlanSwitchingLocked state correctly', () => {
      store.getState().setPlanSwitchingLocked(true);
      expect(store.getState().isPlanSwitchingLocked).toBe(true);

      store.getState().setPlanSwitchingLocked(false);
      expect(store.getState().isPlanSwitchingLocked).toBe(false);
    });
  });

  describe('Plan Management', () => {
    it('sets current plan correctly', () => {
      const plan: ChatPlan = {
        id: 'test-plan',
        name: 'Test Plan',
        isChatEligible: true,
        businessHours: {
          isOpen24x7: false,
          days: [],
          timezone: 'UTC',
          isCurrentlyOpen: false,
        },
        lineOfBusiness: 'medical',
        termsAndConditions: 'Test terms',
        isActive: true,
      };

      store.getState().setCurrentPlan(plan);
      expect(store.getState().currentPlan).toEqual(plan);

      store.getState().setCurrentPlan(null);
      expect(store.getState().currentPlan).toBeNull();
    });

    it('sets available plans correctly', () => {
      const plans: ChatPlan[] = [
        {
          id: 'plan-1',
          name: 'Plan 1',
          isChatEligible: true,
          businessHours: {
            isOpen24x7: false,
            days: [],
            timezone: 'UTC',
            isCurrentlyOpen: false,
          },
          lineOfBusiness: 'medical',
          termsAndConditions: 'Terms 1',
          isActive: true,
        },
        {
          id: 'plan-2',
          name: 'Plan 2',
          isChatEligible: true,
          businessHours: {
            isOpen24x7: false,
            days: [],
            timezone: 'UTC',
            isCurrentlyOpen: false,
          },
          lineOfBusiness: 'dental',
          termsAndConditions: 'Terms 2',
          isActive: true,
        },
      ];

      store.getState().setAvailablePlans(plans);
      expect(store.getState().availablePlans).toEqual(plans);
    });

    it('switches between plans correctly', () => {
      const plans: ChatPlan[] = [
        {
          id: 'plan-1',
          name: 'Plan 1',
          isChatEligible: true,
          businessHours: {
            isOpen24x7: false,
            days: [],
            timezone: 'UTC',
            isCurrentlyOpen: false,
          },
          lineOfBusiness: 'medical',
          termsAndConditions: 'Terms 1',
          isActive: true,
        },
        {
          id: 'plan-2',
          name: 'Plan 2',
          isChatEligible: true,
          businessHours: {
            isOpen24x7: false,
            days: [],
            timezone: 'UTC',
            isCurrentlyOpen: false,
          },
          lineOfBusiness: 'dental',
          termsAndConditions: 'Terms 2',
          isActive: true,
        },
      ];

      store.getState().setAvailablePlans(plans);
      store.getState().setCurrentPlan(plans[0]);
      expect(store.getState().currentPlan).toEqual(plans[0]);

      store.getState().setCurrentPlan(plans[1]);
      expect(store.getState().currentPlan).toEqual(plans[1]);
    });
  });

  describe('Business Hours', () => {
    it('sets business hours correctly', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: false,
        days: [
          {
            day: 'Monday',
            openTime: '09:00',
            closeTime: '17:00',
            isOpen: true,
          },
        ],
        timezone: 'UTC',
        isCurrentlyOpen: true,
      };

      store.getState().setBusinessHours(businessHours);
      expect(store.getState().businessHours).toEqual(businessHours);
    });

    it('handles 24/7 business hours', () => {
      const businessHours: BusinessHours = {
        isOpen24x7: true,
        days: [],
        timezone: 'UTC',
        isCurrentlyOpen: true,
      };

      store.getState().setBusinessHours(businessHours);
      expect(store.getState().businessHours.isOpen24x7).toBe(true);
      expect(store.getState().businessHours.days).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('handles chat initialization errors', () => {
      const error = {
        message: 'Failed to initialize chat',
        code: 'INIT_ERROR',
        isRecoverable: false,
      };

      store.getState().setError(error);
      expect(store.getState().error).toEqual(error);
    });

    it('handles chat session errors', () => {
      const error = {
        message: 'Session error',
        code: 'SESSION_ERROR',
        isRecoverable: true,
      };

      store.getState().setError(error);
      expect(store.getState().error).toEqual(error);
    });

    it('handles plan switching errors', () => {
      const error = {
        message: 'Plan switch error',
        code: 'PLAN_SWITCH_ERROR',
        isRecoverable: true,
      };

      store.getState().setError(error);
      expect(store.getState().error).toEqual(error);
    });
  });
});
