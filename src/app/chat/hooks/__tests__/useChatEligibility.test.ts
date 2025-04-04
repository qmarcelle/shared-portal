import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { mapUserInfoToChatPayload } from '@/utils/chatUtils';
import { act, renderHook } from '@testing-library/react';
import { formatBusinessHours } from '../../services/utils/chatHours';
import { useChatStore } from '../../stores/chatStore';
import { useChatEligibility } from '../useChatEligibility';

// Mock dependencies
jest.mock('@/auth');
jest.mock('@/actions/loggedUserInfo');
jest.mock('@/utils/chatUtils');
jest.mock('../../stores/chatStore');
jest.mock('../../services/utils/chatHours');

describe('useChatEligibility', () => {
  const mockUserInfo = {
    groupData: {
      groupID: 'test-group',
      policyType: 'test-policy',
      groupName: 'Blue Elite Group',
    },
    subscriberID: 'test-subscriber',
    coverageTypes: [
      { productType: 'M' }, // Medical
      { productType: 'D' }, // Dental
      { productType: 'V' }, // Vision
    ],
    authFunctions: [
      { functionName: 'COBRAELIGIBLE', available: true },
      { functionName: 'CHAT_ELIGIBLE', available: true },
      { functionName: 'IDPROTECTELIGIBLE', available: true },
    ],
    members: [
      {
        planDetails: [{ productCategory: 'M', planID: 'medical-plan' }],
        memberSuffix: '01',
      },
    ],
    subscriberDateOfBirth: '1990-01-01',
    subscriberFirstName: 'John',
    subscriberLastName: 'Doe',
  };

  const mockCurrentPlan = {
    id: 'test-plan',
    businessHours: {
      isOpen24x7: false,
      days: [
        {
          day: 'Monday',
          openTime: '09:00',
          closeTime: '17:00',
          isOpen: true,
        },
      ],
      timezone: 'America/New_York',
      isCurrentlyOpen: true,
    },
  };

  const mockChatPayload = {
    memberId: 'test-member',
    planId: 'test-plan',
    groupId: 'test-group',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup auth mock
    (auth as jest.Mock).mockResolvedValue({
      user: {
        currUsr: {
          plan: {
            memCk: 'test-member',
          },
        },
      },
    });

    // Setup getLoggedInUserInfo mock
    (getLoggedInUserInfo as jest.Mock).mockResolvedValue(mockUserInfo);

    // Setup mapUserInfoToChatPayload mock
    (mapUserInfoToChatPayload as jest.Mock).mockReturnValue(mockChatPayload);

    // Setup formatBusinessHours mock
    (formatBusinessHours as jest.Mock).mockReturnValue('9:00 AM - 5:00 PM');

    // Setup useChatStore mock
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector({ currentPlan: mockCurrentPlan });
      }
      return { currentPlan: mockCurrentPlan };
    });
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useChatEligibility());
    expect(result.current.isLoading).toBe(true);
  });

  it('should fetch and process user eligibility information', async () => {
    const { result } = renderHook(() => useChatEligibility());

    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.chatPayload).toEqual(mockChatPayload);
    expect(result.current.isEligible).toBe(true);
    expect(result.current.eligibility).toEqual({
      isChatEligibleMember: true,
      isDemoMember: false,
      isAmplifyMem: false,
      groupId: 'test-group',
      memberClientID: 'test-subscriber',
      getGroupType: 'test-policy',
      isBlueEliteGroup: true,
      isMedical: true,
      isDental: true,
      isVision: true,
      isWellnessOnly: false,
      isCobraEligible: true,
      chatHours: '9:00 AM - 5:00 PM',
      rawChatHours: JSON.stringify(mockCurrentPlan.businessHours),
      isChatbotEligible: true,
      memberMedicalPlanID: 'medical-plan',
      isIDCardEligible: true,
      memberDOB: '1990-01-01',
      subscriberID: 'test-subscriber',
      sfx: '01',
      memberFirstname: 'John',
      memberLastName: 'Doe',
      userID: 'test-subscriber',
      isChatAvailable: true,
      routingchatbotEligible: true,
    });
  });

  it('should handle missing member CK', async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: {
        currUsr: {
          plan: {
            memCk: null,
          },
        },
      },
    });

    const { result } = renderHook(() => useChatEligibility());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      'Failed to fetch user eligibility information',
    );
    expect(result.current.chatPayload).toBeNull();
    expect(result.current.eligibility).toBeNull();
    expect(result.current.isEligible).toBe(false);
  });

  it('should handle API errors', async () => {
    (getLoggedInUserInfo as jest.Mock).mockRejectedValue(
      new Error('API Error'),
    );

    const { result } = renderHook(() => useChatEligibility());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(
      'Failed to fetch user eligibility information',
    );
    expect(result.current.chatPayload).toBeNull();
    expect(result.current.eligibility).toBeNull();
    expect(result.current.isEligible).toBe(false);
  });

  it('should re-fetch when current plan changes', async () => {
    const { rerender } = renderHook(() => useChatEligibility());

    // Initial fetch
    await act(async () => {
      await Promise.resolve();
    });

    // Change current plan
    const newPlan = { ...mockCurrentPlan, id: 'new-plan' };
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector({ currentPlan: newPlan });
      }
      return { currentPlan: newPlan };
    });

    // Re-render with new plan
    await act(async () => {
      rerender();
    });

    // Verify that getLoggedInUserInfo was called again
    expect(getLoggedInUserInfo).toHaveBeenCalledTimes(2);
  });
});
