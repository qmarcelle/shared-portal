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

// Consolidate mock creation and reset logic
export const createMockChatState = (overrides = {}): ChatState => ({
  isOpen: false,
  isMinimized: false,
  newMessageCount: 0,
  isChatActive: false,
  isLoading: true,
  error: null,
  messages: [],
  eligibility: null,
  isPlanSwitcherLocked: false,
  planSwitcherTooltip: '',
  setOpen: jest.fn(),
  setMinimized: jest.fn(),
  setError: jest.fn(),
  addMessage: jest.fn(),
  clearMessages: jest.fn(),
  setChatActive: jest.fn(),
  setLoading: jest.fn(),
  incrementMessageCount: jest.fn(),
  resetMessageCount: jest.fn(),
  setEligibility: jest.fn(),
  setPlanSwitcherLocked: jest.fn(),
  updateConfig: jest.fn(),
  closeAndRedirect: jest.fn(),
  ...overrides,
});

export const setupChatMocks = (options = { autoReset: true }) => {
  const originalWindow = { ...window };
  const mocks = {
    cxBus: {
      configure: jest.fn(),
      command: jest.fn(),
      subscribe: jest.fn(),
    },
    genesysChat: {
      configure: jest.fn(),
      onSessionStart: jest.fn(),
      onSessionEnd: jest.fn(),
      sendMessage: jest.fn(),
    },
    reset: () => {
      Object.values(mocks.cxBus).forEach(mock => mock.mockReset());
      Object.values(mocks.genesysChat).forEach(mock => mock.mockReset());
    },
  };

  beforeAll(() => {
    Object.defineProperty(window, 'CXBus', {
      value: mocks.cxBus,
      writable: true,
    });
    Object.defineProperty(window, 'GenesysChat', {
      value: mocks.genesysChat,
      writable: true,
    });
  });

  if (options.autoReset) {
    afterEach(() => mocks.reset());
  }

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

  return mocks;
};

// Custom render function with providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

