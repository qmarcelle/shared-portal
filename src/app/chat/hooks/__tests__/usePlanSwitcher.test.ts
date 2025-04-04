import { act, renderHook } from '@testing-library/react';
import { ClientType, PlanInfo } from '../../models/plans';
import { useChatStore } from '../../stores/chatStore';
import { usePlanSwitcher } from '../usePlanSwitcher';

// Mock the chat store
jest.mock('../../stores/chatStore');

describe('usePlanSwitcher', () => {
  const mockCurrentPlan: PlanInfo = {
    planId: 'plan-1',
    planName: 'Test Plan 1',
    lineOfBusiness: ClientType.BlueCare,
    isEligibleForChat: true,
    businessHours: '9:00 AM - 5:00 PM',
  };

  const mockAvailablePlans: PlanInfo[] = [
    mockCurrentPlan,
    {
      planId: 'plan-2',
      planName: 'Test Plan 2',
      lineOfBusiness: ClientType.BlueCarePlus,
      isEligibleForChat: true,
      businessHours: '9:00 AM - 5:00 PM',
    },
  ];

  const mockOpenPlanSwitcher = jest.fn();
  const mockSetCurrentPlan = jest.fn();
  const mockLockPlanSwitcher = jest.fn();
  const mockUnlockPlanSwitcher = jest.fn();
  const mockCloseChat = jest.fn();
  const mockOpenChat = jest.fn();

  const defaultProps = {
    currentPlan: mockCurrentPlan,
    availablePlans: mockAvailablePlans,
    openPlanSwitcher: mockOpenPlanSwitcher,
  };

  const mockStore = {
    isOpen: false,
    messages: [],
    isPlanSwitcherLocked: false,
    lockPlanSwitcher: mockLockPlanSwitcher,
    unlockPlanSwitcher: mockUnlockPlanSwitcher,
    setCurrentPlan: mockSetCurrentPlan,
    openChat: mockOpenChat,
    closeChat: mockCloseChat,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatStore.getState as jest.Mock).mockReturnValue(mockStore);
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePlanSwitcher(defaultProps));

    expect(result.current.isPlanSwitcherLocked).toBe(false);
    expect(result.current.showSwitchPlanOption).toBe(true);
    expect(result.current.currentPlanName).toBe('Test Plan 1');
    expect(result.current.displayPlanInfo).toBe(true);
  });

  it('should update current plan in chat store when plan changes', () => {
    renderHook(() => usePlanSwitcher(defaultProps));
    expect(mockSetCurrentPlan).toHaveBeenCalledWith({
      id: mockCurrentPlan.planId,
      name: mockCurrentPlan.planName,
      isChatEligible: mockCurrentPlan.isEligibleForChat,
      lineOfBusiness: mockCurrentPlan.lineOfBusiness,
      businessHours: {
        isOpen24x7: false,
        days: [],
        timezone: 'America/New_York',
        isCurrentlyOpen: false,
      },
      termsAndConditions: '',
      isActive: true,
    });
  });

  it('should lock plan switcher when chat is open with messages', () => {
    const activeStore = {
      ...mockStore,
      isOpen: true,
      messages: [{ id: '1', text: 'Test message' }],
      isPlanSwitcherLocked: true,
    };
    (useChatStore.getState as jest.Mock).mockReturnValue(activeStore);
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(activeStore);
      }
      return activeStore;
    });

    const { result } = renderHook(() => usePlanSwitcher(defaultProps));

    expect(mockLockPlanSwitcher).toHaveBeenCalled();
    expect(result.current.isPlanSwitcherLocked).toBe(true);
    expect(result.current.showSwitchPlanOption).toBe(false);
  });

  it('should unlock plan switcher when chat is closed or has no messages', () => {
    const closedStore = {
      ...mockStore,
      isOpen: false,
      messages: [],
      isPlanSwitcherLocked: false,
    };
    (useChatStore.getState as jest.Mock).mockReturnValue(closedStore);
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(closedStore);
      }
      return closedStore;
    });

    const { result } = renderHook(() => usePlanSwitcher(defaultProps));

    expect(mockUnlockPlanSwitcher).toHaveBeenCalled();
    expect(result.current.isPlanSwitcherLocked).toBe(false);
    expect(result.current.showSwitchPlanOption).toBe(true);
  });

  it('should handle plan switching when chat is not active', () => {
    const { result } = renderHook(() => usePlanSwitcher(defaultProps));

    act(() => {
      result.current.handleSwitchPlan();
    });

    expect(mockCloseChat).toHaveBeenCalled();
    expect(mockOpenPlanSwitcher).toHaveBeenCalled();
  });

  it('should not allow plan switching when chat is active', () => {
    const activeStore = {
      ...mockStore,
      messages: [{ id: '1', text: 'Test message' }],
    };
    (useChatStore.getState as jest.Mock).mockReturnValue(activeStore);
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(activeStore);
      }
      return activeStore;
    });

    const { result } = renderHook(() => usePlanSwitcher(defaultProps));

    act(() => {
      result.current.handleSwitchPlan();
    });

    expect(mockCloseChat).not.toHaveBeenCalled();
    expect(mockOpenPlanSwitcher).not.toHaveBeenCalled();
  });

  it('should not show switch option when there is only one plan', () => {
    const { result } = renderHook(() =>
      usePlanSwitcher({
        ...defaultProps,
        availablePlans: [mockCurrentPlan],
      }),
    );

    expect(result.current.showSwitchPlanOption).toBe(false);
    expect(result.current.displayPlanInfo).toBe(false);
  });

  it('should handle null current plan', () => {
    const { result } = renderHook(() =>
      usePlanSwitcher({
        ...defaultProps,
        currentPlan: null,
      }),
    );

    expect(result.current.currentPlanName).toBeNull();
  });
});
