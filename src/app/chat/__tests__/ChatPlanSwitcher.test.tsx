import { renderHook } from '@testing-library/react';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';
import { useChatStore } from '../stores/chatStore';

// Mock dependencies
jest.mock('../stores/chatStore', () => ({
  useChatStore: jest.fn(),
}));

// Mock logger to avoid console noise
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('ChatPlanSwitcher', () => {
  // Mock store state and functions
  const mockSetPlanSwitcherLocked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should lock plan switcher when chat becomes active', () => {
    // Setup initial state: chat is not active
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: false,
      isPlanSwitcherLocked: false,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
    });

    // Render the hook
    const { rerender } = renderHook(() => usePlanSwitcherLock());

    // Verify initial state
    expect(mockSetPlanSwitcherLocked).not.toHaveBeenCalled();

    // Update the state to simulate chat becoming active
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: true,
      isPlanSwitcherLocked: false,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
    });

    // Re-render the hook with the new state
    rerender();

    // Verify that the plan switcher was locked
    expect(mockSetPlanSwitcherLocked).toHaveBeenCalledWith(true);
  });

  it('should unlock plan switcher when chat becomes inactive', () => {
    // Setup initial state: chat is active and locked
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: true,
      isPlanSwitcherLocked: true,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
    });

    // Render the hook
    const { rerender } = renderHook(() => usePlanSwitcherLock());

    // Verify initial state - should not change anything since it's already locked
    expect(mockSetPlanSwitcherLocked).not.toHaveBeenCalled();

    // Update the state to simulate chat becoming inactive
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: false,
      isPlanSwitcherLocked: true,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
    });

    // Re-render the hook with the new state
    rerender();

    // Verify that the plan switcher was unlocked
    expect(mockSetPlanSwitcherLocked).toHaveBeenCalledWith(false);
  });

  it('should not change lock state if chat activity status has not changed', () => {
    // Setup initial state: chat is active and locked
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: true,
      isPlanSwitcherLocked: true,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
    });

    // Render the hook
    const { rerender } = renderHook(() => usePlanSwitcherLock());

    // Mock some other state change but keep the same activity status
    (useChatStore as jest.Mock).mockReturnValue({
      isChatActive: true, // Still active
      isPlanSwitcherLocked: true,
      setPlanSwitcherLocked: mockSetPlanSwitcherLocked,
      // Some other irrelevant state changes...
      messages: ['New message'],
    });

    // Re-render with the new state
    rerender();

    // Verify that setPlanSwitcherLocked was not called again
    expect(mockSetPlanSwitcherLocked).not.toHaveBeenCalled();
  });
});
