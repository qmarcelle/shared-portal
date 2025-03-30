import '@testing-library/jest-dom';

// Mock global objects that might not be available in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.crypto.randomUUID if not available in test environment
if (!window.crypto) {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-123456789',
      getRandomValues: () => new Uint32Array(10).fill(1),
    },
  });
} else if (!window.crypto.randomUUID) {
  window.crypto.randomUUID = () => 'test-uuid-123456789';
}

// Mock fetch API
global.fetch = jest.fn();

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock window.crypto for UUID generation
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (buffer: Uint8Array) => {
      return crypto.getRandomValues(buffer);
    },
    subtle: {},
  },
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Define types for global objects in test environment
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }

  namespace NodeJS {
    interface Global {
      fetch: jest.Mock;
      Audio: typeof MockAudio;
    }
  }

  interface Window {
    CobrowseIO?: any;
  }
}
