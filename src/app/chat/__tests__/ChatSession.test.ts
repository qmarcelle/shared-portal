import { renderHook, act } from '@testing-library/react';
import { useChatSession } from '../hooks/useChatSession';
import { useChatStore } from '../stores/chatStore';
import { ChatService } from '../services/ChatService';

// Mock dependencies
jest.mock('../stores/chatStore');
jest.mock('../services/ChatService');

// Mock the logger to avoid console noise during tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('ChatSession', () => {
  // Save original window object
  const originalWindow = { ...window };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup chat store mock
    (useChatStore as jest.Mock).mockImplementation(() => ({
      isOpen: false,
      isMinimized: false,
      isChatActive: false,
      error: null,
      eligibility: {
        isEligible: true,
        cloudChatEligible: true,
        workingHours: 'M_F_8_17',
        hoursAvailable: true
      },
      isLoading: false,
      setOpen: jest.fn(),
      setMinimized: jest.fn(),
      setError: jest.fn(),
      setChatActive: jest.fn(),
      setLoading: jest.fn(),
      setEligibility: jest.fn(),
      // Mock implementation for getState
      getState: jest.fn().mockReturnValue({
        eligibility: {
          isEligible: true,
          cloudChatEligible: true,
          workingHours: 'M_F_8_17',
          hoursAvailable: true,
          chatBotEligibility: true,
          chatAvailable: true
        }
      })
    }));
    
    // Mock static getState method
    useChatStore.getState = jest.fn().mockReturnValue({
      eligibility: {
        isEligible: true,
        cloudChatEligible: true,
        workingHours: 'M_F_8_17',
        hoursAvailable: true,
        chatBotEligibility: true,
        chatAvailable: true
      }
    });
    
    // Mock ChatService constructor and methods
    (ChatService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      startChat: jest.fn().mockResolvedValue(undefined),
      endChat: jest.fn().mockResolvedValue(undefined),
      sendMessage: jest.fn().mockResolvedValue(undefined)
    }));
    
    // Mock global window objects for Genesys
    global.window.CXBus = {
      on: jest.fn(),
      runtime: {
        unsubscribe: jest.fn()
      }
    };
    
    global.window.MessengerWidget = {
      on: jest.fn(),
      off: jest.fn()
    };
  });
  
  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });
  
  it('should initialize chat service with the correct parameters', async () => {
    const options = {
      memberId: '12345',
      planId: 'GROUP123',
      planName: 'Test Health Plan',
      hasMultiplePlans: false,
      cloudChatEligible: true,
      chatConfig: {
        enabled: true,
        cloudChatEligible: true
      }
    };
    
    // Set mock fetch response for auth token
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token: 'mock-token' })
    });
    
    // Using renderHook but without expecting the initialization to complete
    renderHook(() => useChatSession(options));
    
    // Verify ChatService was initialized with correct parameters
    expect(ChatService).toHaveBeenCalledWith(
      options.memberId,
      options.planId,
      options.planName,
      options.hasMultiplePlans,
      expect.any(Function),
      expect.any(Object)
    );
  });
  
  it('should register event handlers for chat events', async () => {
    const options = {
      memberId: '12345',
      planId: 'GROUP123',
      chatConfig: {}
    };
    
    const mockSetChatActive = jest.fn();
    (useChatStore as jest.Mock).mockImplementation(() => ({
      isOpen: false,
      isMinimized: false,
      isChatActive: false,
      error: null,
      eligibility: {
        chatBotEligibility: true,
        chatAvailable: true
      },
      isLoading: false,
      setChatActive: mockSetChatActive,
      setEligibility: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn()
    }));
    
    // Using renderHook
    renderHook(() => useChatSession(options));
    
    // Verify event handlers were registered
    expect(window.CXBus.on).toHaveBeenCalledWith('WebChat.opened', expect.any(Function));
    expect(window.CXBus.on).toHaveBeenCalledWith('WebChat.closed', expect.any(Function));
    expect(window.CXBus.on).toHaveBeenCalledWith('WebChat.error', expect.any(Function));
    
    expect(window.MessengerWidget.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(window.MessengerWidget.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(window.MessengerWidget.on).toHaveBeenCalledWith('error', expect.any(Function));
    
    // Trigger WebChat.opened event
    const openCallArgs = (window.CXBus.on as jest.Mock).mock.calls.find(
      call => call[0] === 'WebChat.opened'
    );
    if (openCallArgs && openCallArgs[1]) {
      const openCallback = openCallArgs[1];
      openCallback();
      expect(mockSetChatActive).toHaveBeenCalledWith(true);
    }
    
    // Trigger WebChat.closed event
    const closeCallArgs = (window.CXBus.on as jest.Mock).mock.calls.find(
      call => call[0] === 'WebChat.closed'
    );
    if (closeCallArgs && closeCallArgs[1]) {
      const closeCallback = closeCallArgs[1];
      closeCallback();
      expect(mockSetChatActive).toHaveBeenCalledWith(false);
    }
  });
  
  it('should handle errors during initialization', async () => {
    const options = {
      memberId: '12345',
      planId: 'GROUP123',
      chatConfig: {}
    };
    
    const mockSetError = jest.fn();
    (useChatStore as jest.Mock).mockImplementation(() => ({
      isOpen: false,
      isMinimized: false,
      isChatActive: false,
      error: null,
      eligibility: null,
      isLoading: true,
      setChatActive: jest.fn(),
      setEligibility: jest.fn(),
      setLoading: jest.fn(),
      setError: mockSetError
    }));
    
    // Mock ChatService to throw an error during initialization
    (ChatService as jest.Mock).mockImplementation(() => ({
      initialize: jest.fn().mockRejectedValue(new Error('Initialization failed')),
      startChat: jest.fn(),
      endChat: jest.fn(),
      sendMessage: jest.fn()
    }));
    
    // Using renderHook
    renderHook(() => useChatSession(options));
    
    // Let async operations complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify error was set
    expect(mockSetError).toHaveBeenCalledWith(expect.any(Error));
  });
});