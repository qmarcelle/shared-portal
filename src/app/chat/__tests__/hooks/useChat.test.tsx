import { useChat } from '@/app/chat/hooks/useChat';
import { ChatService } from '@/app/chat/services/ChatService';
import { useChatStore } from '@/app/chat/stores/chatStore';
import { ChatError } from '@/app/chat/types';
import { renderHook } from '@testing-library/react-hooks';

// Mock dependencies
jest.mock('@/app/chat/services/ChatService');
jest.mock('@/app/chat/stores/chatStore');
jest.mock('@/utils/api/memberService', () => ({
  memberService: {
    get: jest.fn().mockResolvedValue({
      status: 200,
      data: {
        isEligible: true,
        cloudChatEligible: true,
        chatGroup: 'test-group',
        businessHours: { text: 'MON_9-17', isOpen: true }
      }
    })
  }
}));

describe('useChat', () => {
  const mockOptions = {
    memberId: 'test-member-id',
    planId: 'test-plan-id',
    planName: 'Test Plan',
    hasMultiplePlans: true,
    onLockPlanSwitcher: jest.fn(),
  };

  const mockChatState = {
    isOpen: false,
    isMinimized: false,
    isChatActive: false,
    error: null,
    eligibility: null,
    isLoading: false,
    setOpen: jest.fn(),
    setMinimized: jest.fn(),
    setError: jest.fn(),
    setChatActive: jest.fn(),
    setLoading: jest.fn(),
    setEligibility: jest.fn(),
    setPlanSwitcherLocked: jest.fn(),
    updateConfig: jest.fn(),
  };

  beforeEach(() => {
    // Set up mock implementations
    jest.clearAllMocks();
    (useChatStore as unknown as jest.Mock).mockReturnValue(mockChatState);
    
    // Mock ChatService constructor and methods
    (ChatService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      getChatInfo: jest.fn().mockResolvedValue({
        chatAvailable: true,
        cloudChatEligible: true,
        chatGroup: 'test-group',
        workingHours: 'MON_9-17',
      }),
      startChat: jest.fn().mockResolvedValue(undefined),
      endChat: jest.fn().mockResolvedValue(undefined),
      sendMessage: jest.fn().mockResolvedValue(undefined),
      memberId: mockOptions.memberId,
      planId: mockOptions.planId,
      planName: mockOptions.planName,
      hasMultiplePlans: mockOptions.hasMultiplePlans,
    }));
  });

  it('should initialize correctly with options', () => {
    const { result } = renderHook(() => useChat(mockOptions));

    expect(result.current).toHaveProperty('isInitialized');
    expect(result.current).toHaveProperty('isOpen');
    expect(result.current).toHaveProperty('isMinimized');
    expect(result.current).toHaveProperty('isChatActive');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('eligibility');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('openChat');
    expect(result.current).toHaveProperty('closeChat');
  });

  it('should fetch eligibility on mount', async () => {
    const { waitForNextUpdate } = renderHook(() => useChat(mockOptions));
    await waitForNextUpdate();

    expect(mockChatState.setLoading).toHaveBeenCalledWith(true);
    expect(mockChatState.setEligibility).toHaveBeenCalled();
    expect(mockChatState.setLoading).toHaveBeenCalledWith(false);
  });

  it('should initialize chat when not initialized', async () => {
    const { waitForNextUpdate } = renderHook(() => useChat(mockOptions));
    await waitForNextUpdate();

    expect(mockChatState.setLoading).toHaveBeenCalledWith(true);
    expect(mockChatState.updateConfig).toHaveBeenCalled();
  });

  it('should handle chat errors gracefully', async () => {
    // Override mock to throw an error
    (ChatService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn().mockRejectedValue(new ChatError('Test error', 'TEST_ERROR')),
      getChatInfo: jest.fn().mockRejectedValue(new ChatError('Test error', 'TEST_ERROR')),
      startChat: jest.fn(),
      endChat: jest.fn(),
      sendMessage: jest.fn(),
      memberId: mockOptions.memberId,
      planId: mockOptions.planId,
      planName: mockOptions.planName,
      hasMultiplePlans: mockOptions.hasMultiplePlans,
    }));

    const { waitForNextUpdate } = renderHook(() => useChat(mockOptions));
    await waitForNextUpdate();

    expect(mockChatState.setError).toHaveBeenCalled();
  });

  // Add more tests as needed for specific functionality
});
