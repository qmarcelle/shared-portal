import { ChatInfoResponse, ChatState } from '@/app/chat/types/index';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock data generators
export const createMockChatInfo = (overrides = {}): ChatInfoResponse => ({
  chatGroup: 'default',
  workingHours: '9:00-17:00',
  chatAvailable: true,
  cloudChatEligible: true,
  ...overrides,
});

export const createMockChatState = (overrides = {}): ChatState => ({
  isOpen: false,
  isInChat: false,
  messages: [],
  currentPlan: null,
  error: null,
  isPlanSwitcherLocked: false,
  session: null,
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
