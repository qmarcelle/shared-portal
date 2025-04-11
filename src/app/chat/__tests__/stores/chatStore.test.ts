import { ChatError } from '@/app/chat/types/index';
import { act, renderHook } from '@testing-library/react';
import { useChatStore } from '../../stores/chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useChatStore.getState();
    act(() => {
      store.closeChat();
      store.setError(null);
      store.messages = [];
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useChatStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
  });

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

  it('adds message', () => {
    const { result } = renderHook(() => useChatStore());
    const message = {
      id: '1',
      content: 'Hello',
      sender: 'user' as const,
      timestamp: Date.now(),
    };

    act(() => {
      result.current.messages.push(message);
    });

    expect(result.current.messages).toEqual([message]);
  });

  it('adds multiple messages in order', () => {
    const { result } = renderHook(() => useChatStore());
    const messages = [
      {
        id: '1',
        content: 'Hello',
        sender: 'user' as const,
        timestamp: Date.now(),
      },
      {
        id: '2',
        content: 'Hi there',
        sender: 'agent' as const,
        timestamp: Date.now() + 1000,
      },
    ];

    act(() => {
      messages.forEach((msg) => result.current.messages.push(msg));
    });

    expect(result.current.messages).toEqual(messages);
  });

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

  it('maintains state between hook instances', () => {
    const { result: instance1 } = renderHook(() => useChatStore());
    const { result: instance2 } = renderHook(() => useChatStore());

    act(() => {
      instance1.current.openChat();
    });

    expect(instance2.current.isOpen).toBe(true);
  });
});
