import { ChatConfig, ChatError, ChatMessage } from '@/app/(protected)/(common)/member/chat/types/index';
import { act, renderHook } from '@testing-library/react';
import { useChatStore } from '../../stores/chatStore';

describe('chatStore', () => {
  const mockConfig: ChatConfig = {
    cloudChatEligible: true,
    planName: 'Test Plan',
    memberId: '12345',
    planId: 'plan123',
  };

  beforeEach(() => {
    // Reset store state before each test
    const store = useChatStore.getState();
    act(() => {
      store.closeChat();
      store.setError(null);
      store.resetMessages();
      store.updateConfig(null);
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useChatStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.config).toBeNull();
    expect(result.current.isEligible).toBe(false);
  });

  describe('chat window controls', () => {
    it('opens chat', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.openChat();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('closes chat', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.openChat();
        result.current.closeChat();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('minimizes chat', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.openChat();
        result.current.minimizeChat();
      });

      expect(result.current.isMinimized).toBe(true);
      expect(result.current.isOpen).toBe(true);
    });

    it('maximizes chat', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.openChat();
        result.current.minimizeChat();
        result.current.maximizeChat();
      });

      expect(result.current.isMinimized).toBe(false);
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('message handling', () => {
    it('adds message using addMessage action', () => {
      const { result } = renderHook(() => useChatStore());
      const message: ChatMessage = {
        id: '1',
        content: 'Hello',
        sender: 'user',
        timestamp: Date.now(),
      };

      act(() => {
        result.current.addMessage(message);
      });

      expect(result.current.messages).toEqual([message]);
    });

    it('adds multiple messages in order using addMessage', () => {
      const { result } = renderHook(() => useChatStore());
      const messages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hello',
          sender: 'user',
          timestamp: Date.now(),
        },
        {
          id: '2',
          content: 'Hi there',
          sender: 'agent',
          timestamp: Date.now() + 1000,
        },
      ];

      act(() => {
        messages.forEach((msg) => result.current.addMessage(msg));
      });

      expect(result.current.messages).toEqual(messages);
    });

    it('resets messages', () => {
      const { result } = renderHook(() => useChatStore());
      const message: ChatMessage = {
        id: '1',
        content: 'Hello',
        sender: 'user',
        timestamp: Date.now(),
      };

      act(() => {
        result.current.addMessage(message);
        result.current.resetMessages();
      });

      expect(result.current.messages).toEqual([]);
    });
  });

  describe('configuration and eligibility', () => {
    it('updates configuration', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.updateConfig(mockConfig);
      });

      expect(result.current.config).toEqual(mockConfig);
      expect(result.current.isEligible).toBe(true);
    });

    it('handles null configuration', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.updateConfig(null);
      });

      expect(result.current.config).toBeNull();
      expect(result.current.isEligible).toBe(false);
    });

    it('updates eligibility based on config', () => {
      const { result } = renderHook(() => useChatStore());

      act(() => {
        result.current.updateConfig({
          ...mockConfig,
          cloudChatEligible: false,
        });
      });

      expect(result.current.isEligible).toBe(false);
    });
  });

  describe('error handling', () => {
    it('sets error', () => {
      const { result } = renderHook(() => useChatStore());
      const error = new ChatError('Test error', 'TEST_ERROR', 'error');

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });

    it('clears error', () => {
      const { result } = renderHook(() => useChatStore());
      const error = new ChatError('Test error', 'TEST_ERROR', 'error');

      act(() => {
        result.current.setError(error);
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  it('maintains state between hook instances', () => {
    const { result: instance1 } = renderHook(() => useChatStore());
    const { result: instance2 } = renderHook(() => useChatStore());

    act(() => {
      instance1.current.openChat();
      instance1.current.updateConfig(mockConfig);
    });

    expect(instance2.current.isOpen).toBe(true);
    expect(instance2.current.config).toEqual(mockConfig);
  });
});
