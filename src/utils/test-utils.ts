import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ChatState } from '../app/chat/stores/chatStore';
import { ChatInfoResponse } from '../app/chat/types/index';

// Extend Window interface
declare global {
  interface Window {
    GenesysChat: {
      configure: jest.Mock;
      onSessionStart: jest.Mock;
      onSessionEnd: jest.Mock;
      sendMessage: jest.Mock;
    };
  }
}

// Mock data generators
export const createMockChatInfo = (overrides = {}): ChatInfoResponse => ({
  chatGroup: 'default',
  workingHours: '9:00-17:00',
  chatAvailable: true,
  cloudChatEligible: true,
  isEligible: true,
  ...overrides,
});

export const createMockChatState = (overrides = {}): ChatState => ({
  // UI state
  isOpen: false,
  isMinimized: false,
  newMessageCount: 0,

  // Chat state
  isChatActive: false,
  isLoading: true,
  error: null,
  messages: [],

  // Eligibility state
  eligibility: null,

  // Plan switching
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',

  // Actions
  setOpen: () => {},
  setMinimized: () => {},
  setError: () => {},
  addMessage: () => {},
  clearMessages: () => {},
  setChatActive: () => {},
  setLoading: () => {},
  incrementMessageCount: () => {},
  resetMessageCount: () => {},
  setEligibility: () => {},
  setPlanSwitcherLocked: () => {},
  updateConfig: () => {},

  ...overrides,
});

// Mock window.CXBus for Genesys Cloud
export const mockCXBus = {
  configure: jest.fn(),
  command: jest.fn(),
  subscribe: jest.fn(),
};

// Mock window.GenesysChat for legacy chat
export const mockGenesysChat = {
  configure: jest.fn(),
  onSessionStart: jest.fn(),
  onSessionEnd: jest.fn(),
  sendMessage: jest.fn(),
};

// Custom render function with providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

// Reset all mocks between tests
export const resetMocks = () => {
  jest.clearAllMocks();
  Object.assign(mockCXBus, {
    configure: jest.fn(),
    command: jest.fn(),
    subscribe: jest.fn(),
  });
  Object.assign(mockGenesysChat, {
    configure: jest.fn(),
    onSessionStart: jest.fn(),
    onSessionEnd: jest.fn(),
    sendMessage: jest.fn(),
  });
};

// Mock window globals
export const setupWindowMocks = () => {
  const originalWindow = { ...window };

  beforeAll(() => {
    Object.defineProperty(window, 'CXBus', {
      value: mockCXBus,
      writable: true,
    });
    Object.defineProperty(window, 'GenesysChat', {
      value: mockGenesysChat,
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'CXBus', {
      value: originalWindow.CXBus,
      writable: true,
    });
    Object.defineProperty(window, 'GenesysChat', {
      value: originalWindow.GenesysChat,
      writable: true,
    });
  });
};
