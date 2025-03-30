import { act, renderHook } from '@testing-library/react-hooks';
import { useChatStore } from '../../utils/chatStore';

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
    expect(result.current.isChatAvailable).toBe(false);
    expect(result.current.isWithinHours).toBe(true);
    expect(result.current.selectedTopic).toBeNull();
    expect(result.current.showingDisclaimer).toBe(false);
    expect(result.current.cobrowseState).toBe('inactive');
    expect(result.current.sessionToken).toBeNull();
  });

  test('should toggle chat open state', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.setOpen(true);
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.setOpen(false);
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  test('should add messages to the store', () => {
    const { result } = renderHook(() => useChatStore());
    const testMessage = { text: 'Hello', sender: 'user' as const };
    
    act(() => {
      result.current.addMessage(testMessage);
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('Hello');
    expect(result.current.messages[0].sender).toBe('user');
    expect(result.current.messages[0].id).toBeDefined();
    expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
  });

  test('should set topic', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.setTopic('Benefits');
    });
    
    expect(result.current.selectedTopic).toBe('Benefits');
  });

  test('should toggle disclaimer visibility', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.showDisclaimer();
    });
    
    expect(result.current.showingDisclaimer).toBe(true);
    
    act(() => {
      result.current.hideDisclaimer();
    });
    
    expect(result.current.showingDisclaimer).toBe(false);
  });

  test('should update cobrowse state', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.setCobrowseState('pending');
    });
    
    expect(result.current.cobrowseState).toBe('pending');
    
    act(() => {
      result.current.setCobrowseState('active');
    });
    
    expect(result.current.cobrowseState).toBe('active');
  });

  test('should set session token', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.setSessionToken('abc123');
    });
    
    expect(result.current.sessionToken).toBe('abc123');
    
    act(() => {
      result.current.setSessionToken(null);
    });
    
    expect(result.current.sessionToken).toBeNull();
  });

  test('should check chat hours and update state', () => {
    const { result } = renderHook(() => useChatStore());
    // Mock implementation of checking chat hours
    const rawChatHours = 'Monday-Friday_8:00am-5:00pm_17.00';
    
    // Mock current time to be after hours
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockImplementation(() => '18:30:00');
    
    act(() => {
      result.current.checkChatHours(rawChatHours);
    });
    
    expect(result.current.isWithinHours).toBe(false);
    
    // Reset mock
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockRestore();
    
    // Mock current time to be during hours
    jest.spyOn(Date.prototype, 'toLocaleTimeString').mockImplementation(() => '14:30:00');
    
    act(() => {
      result.current.checkChatHours(rawChatHours);
    });
    
    expect(result.current.isWithinHours).toBe(true);
  });
}); 