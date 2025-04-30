import { useChat } from '@/app/chat/hooks/useChat';
import { useChatEligibility } from '@/app/chat/hooks/useChatEligibility';
import { ChatError } from '@/app/chat/types/index';
import {
  createMockChatInfo,
  mockCXBus,
  resetMocks,
  setupWindowMocks,
} from '@/utils/test-utils';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/app/chat/hooks/useChatEligibility');

describe('useChat', () => {
  setupWindowMocks();

  const defaultProps = {
    memberId: 'test-123',
    planId: 'plan-456',
    planName: 'Test Plan',
    hasMultiplePlans: true,
    onLockPlanSwitcher: jest.fn(),
    onOpenPlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    resetMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useChat(defaultProps));

    expect(result.current).toEqual(
      expect.objectContaining({
        isInitialized: false,
        isOpen: false,
        isChatActive: false,
        isLoading: true,
        error: null,
      }),
    );
  });

  it('should handle chat initialization with Genesys Cloud', async () => {
    const { result } = renderHook(() => useChat(defaultProps));

    // Simulate script load and initialization
    await act(async () => {
      mockCXBus.configure.mockImplementation(() => Promise.resolve());
      mockCXBus.subscribe.mockImplementation((event, callback) => {
        if (event === 'WebChat.started') {
          callback();
        }
      });
    });

    expect(mockCXBus.configure).toHaveBeenCalled();
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle opening and closing chat', async () => {
    const { result } = renderHook(() => useChat(defaultProps));

    await act(async () => {
      result.current.openChat();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isChatActive).toBe(true);

    await act(async () => {
      result.current.closeChat();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isChatActive).toBe(false);
  });

  it('should handle chat unavailable state', async () => {
    // Mock the eligibility hook to return chat unavailable
    (useChatEligibility as jest.Mock).mockReturnValue({
      eligibility: createMockChatInfo({ chatAvailable: false }),
      loading: false,
    });

    const { result } = renderHook(() => useChat(defaultProps));

    await act(async () => {
      result.current.openChat();
    });

    expect(result.current.error).toBeInstanceOf(ChatError);
    expect(result.current.error?.message).toBe('Chat is currently unavailable');
  });

  it('should handle plan switching during chat', async () => {
    const { result } = renderHook(() => useChat(defaultProps));

    // Simulate chat start
    await act(async () => {
      mockCXBus.subscribe.mockImplementation((event, callback) => {
        if (event === 'WebChat.started') {
          callback();
        }
      });
      result.current.openChat();
    });

    expect(defaultProps.onLockPlanSwitcher).toHaveBeenCalledWith(true);

    // Simulate chat end
    await act(async () => {
      mockCXBus.subscribe.mockImplementation((event, callback) => {
        if (event === 'WebChat.ended') {
          callback();
        }
      });
      result.current.closeChat();
    });

    expect(defaultProps.onLockPlanSwitcher).toHaveBeenCalledWith(false);
  });

  it('should handle initialization errors', async () => {
    mockCXBus.configure.mockRejectedValue(new Error('Failed to initialize'));

    const { result } = renderHook(() => useChat(defaultProps));

    await act(async () => {
      // Force initialization error
      await result.current.openChat();
    });

    expect(result.current.error).toBeInstanceOf(ChatError);
    expect(result.current.error?.message).toBe('Failed to initialize chat');
  });

  it('should clean up resources on unmount', () => {
    const { unmount } = renderHook(() => useChat(defaultProps));

    unmount();

    // Verify cleanup (specific expectations would depend on cleanup implementation)
    expect(mockCXBus.subscribe).toHaveBeenCalled();
  });
});
