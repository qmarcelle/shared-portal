import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { ChatPersistence } from '../components/ChatPersistence';

// Mock the stores and hooks without type issues
const mockSetMinimized = jest.fn();
const mockSetOpen = jest.fn();
const mockChatHooks = {
  isMinimized: false,
  isOpen: false,
  setMinimized: mockSetMinimized,
  setOpen: mockSetOpen,
};

// Mock the chat store module
jest.mock('../stores/chatStore', () => ({
  useChatStore: () => mockChatHooks,
}));

// Mock storage
const mockLocalStorage: Record<string, string> = {};

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => mockLocalStorage[key] || null),
    setItem: jest.fn((key, value) => {
      mockLocalStorage[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete mockLocalStorage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(mockLocalStorage).forEach((key) => {
        delete mockLocalStorage[key];
      });
    }),
  },
  writable: true,
});

// Mock the logger to avoid console noise during tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('ChatPersistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage['chat_minimized'] = 'false';
    mockLocalStorage['chat_open'] = 'false';

    // Reset mock state
    mockChatHooks.isMinimized = false;
    mockChatHooks.isOpen = false;
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should restore chat state from localStorage on mount', () => {
    // Set initial storage state
    window.localStorage.setItem('chat_minimized', 'true');
    window.localStorage.setItem('chat_open', 'true');

    render(<ChatPersistence />);

    // Check that the store was updated with persisted values
    expect(mockSetMinimized).toHaveBeenCalledWith(true);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('should save chat state to localStorage when state changes', () => {
    // Initial state - both false
    const { rerender } = render(<ChatPersistence />);

    // Update state for the next render
    mockChatHooks.isMinimized = true;
    mockChatHooks.isOpen = true;

    // Rerender to trigger the effect
    rerender(<ChatPersistence />);

    // Check that localStorage was updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'chat_minimized',
      'true',
    );
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'chat_open',
      'true',
    );
  });

  it('should handle missing localStorage values gracefully', () => {
    // Clear mock storage
    window.localStorage.clear();

    render(<ChatPersistence />);

    // Default values should be applied (both false)
    expect(mockSetMinimized).not.toHaveBeenCalled();
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('should handle invalid localStorage values', () => {
    // Set invalid values
    window.localStorage.setItem('chat_minimized', 'invalid_value');
    window.localStorage.setItem('chat_open', 'invalid_value');

    render(<ChatPersistence />);

    // Should default to false for invalid values
    expect(mockSetMinimized).not.toHaveBeenCalled();
    expect(mockSetOpen).not.toHaveBeenCalled();
  });
});
