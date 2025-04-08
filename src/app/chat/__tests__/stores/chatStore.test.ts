import { act, renderHook } from '@testing-library/react-hooks';
import { ChatMessage } from '../../models/types';
import { useChatStore } from '../../stores/chatStore';

describe('useChatStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useChatStore());
    act(() => {
      result.current.reset();
    });
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useChatStore());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(result.current.isChatActive).toBe(false);
    expect(result.current.isWithinBusinessHours).toBe(false);
    expect(result.current.currentPlan).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.session).toBeNull();
  });

  test('should toggle chat open state', () => {
    const { result } = renderHook(() => useChatStore());

    act(() => {
      result.current.openChat();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeChat();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test('should add messages to the store', () => {
    const { result } = renderHook(() => useChatStore());
    const testMessage: ChatMessage = {
      id: '1',
      content: 'Hello',
      sender: 'user',
      timestamp: Date.now(),
    };

    act(() => {
      result.current.addMessage(testMessage);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');
    expect(result.current.messages[0].sender).toBe('user');
  });
});
