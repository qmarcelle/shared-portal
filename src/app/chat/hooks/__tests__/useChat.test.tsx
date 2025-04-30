import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { loadGenesysScript } from '../../services/ChatService';
import type { CXBusType } from '../../types';
import type { UseChatOptions } from '../useChat';
import { useChat } from '../useChat';

// Mock the chat eligibility hook
const mockUseChatEligibility = jest.fn().mockReturnValue({
  eligibility: {
    chatAvailable: true,
    cloudChatEligible: true,
  },
  loading: false,
});

jest.mock('../useChatEligibility', () => ({
  useChatEligibility: () => mockUseChatEligibility(),
}));

jest.mock('../../services/ChatService', () => ({
  loadGenesysScript: jest.fn().mockResolvedValue(undefined),
}));

describe('useChat', () => {
  const mockProps: UseChatOptions = {
    memberId: '123',
    planId: 'PLAN-456',
    planName: 'Test Plan',
    hasMultiplePlans: true,
    onLockPlanSwitcher: jest.fn(),
    onOpenPlanSwitcher: jest.fn(),
  };

  beforeEach(() => {
    window.CXBus = {
      configure: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn(),
      command: jest.fn().mockResolvedValue(undefined),
      publishEvent: jest.fn(),
      getState: jest.fn().mockResolvedValue({}),
      destroy: jest.fn(),
      restart: jest.fn(),
    } as unknown as CXBusType;

    // Reset mocks
    jest.clearAllMocks();
    mockUseChatEligibility.mockReturnValue({
      eligibility: {
        chatAvailable: true,
        cloudChatEligible: true,
      },
      loading: false,
    });
  });

  afterEach(() => {
    delete window.CXBus;
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useChat(mockProps));

      expect(result.current).toEqual({
        isInitialized: false,
        isOpen: false,
        isChatActive: false,
        isLoading: true,
        eligibility: {
          chatAvailable: true,
          cloudChatEligible: true,
        },
        error: null,
        openChat: expect.any(Function),
        closeChat: expect.any(Function),
      });
    });

    it('should load Genesys script and initialize chat', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(loadGenesysScript).toHaveBeenCalledWith(
        'https://apps.mypurecloud.com/widgets/9.0/webcomponents/cxw-widget-connector.js',
      );
      expect(result.current.isInitialized).toBe(true);
    });

    it('should handle script loading failure', async () => {
      (loadGenesysScript as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to load script'),
      );

      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization and error handling
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isInitialized).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Chat Controls', () => {
    it('should handle opening chat', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.openChat();
        await Promise.resolve();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.isChatActive).toBe(true);
    });

    it('should handle closing chat', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.openChat();
        await Promise.resolve();
      });

      await act(async () => {
        result.current.closeChat();
        await Promise.resolve();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.isChatActive).toBe(false);
    });

    it('should not open chat when chat is unavailable', async () => {
      // Update mock to return chat unavailable
      mockUseChatEligibility.mockReturnValue({
        eligibility: {
          chatAvailable: false,
          cloudChatEligible: false,
        },
        loading: false,
      });

      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.openChat();
        await Promise.resolve();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Genesys Cloud Integration', () => {
    it('should configure Genesys Cloud when available', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(window.CXBus?.configure).toHaveBeenCalled();
      expect(window.CXBus?.subscribe).toHaveBeenCalledWith(
        'WebChat.started',
        expect.any(Function),
      );
    });

    it('should handle chat session events', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Get the WebChat.started callback
      const startedCallback = (
        window.CXBus?.subscribe as jest.Mock
      ).mock.calls.find((call) => call[0] === 'WebChat.started')?.[1];

      expect(startedCallback).toBeDefined();

      // Simulate chat start
      await act(async () => {
        startedCallback?.();
        await Promise.resolve();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.isChatActive).toBe(true);
      expect(mockProps.onLockPlanSwitcher).toHaveBeenCalledWith(true);
    });

    it('should handle plan switching requests', async () => {
      const { result } = renderHook(() => useChat(mockProps));

      // Wait for initialization
      await act(async () => {
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      // Get the planSwitchRequested callback
      const planSwitchCallback = (
        window.CXBus?.subscribe as jest.Mock
      ).mock.calls.find(
        (call) => call[0] === 'WebChat.planSwitchRequested',
      )?.[1];

      expect(planSwitchCallback).toBeDefined();

      // Simulate plan switch request
      await act(async () => {
        planSwitchCallback?.();
        await Promise.resolve();
      });

      expect(mockProps.onOpenPlanSwitcher).toHaveBeenCalled();
    });
  });
});
