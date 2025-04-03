/**
 * Jest test setup file - configures the test environment
 * This is a consolidated setup file combining previous setup.ts and jest-setup.ts
 */

// Import testing libraries
import '@testing-library/jest-dom';

// Import the server from mocks folder
import { server } from '../mocks/server';

// Set environment variables for tests
process.env.PORTAL_SERVICES_URL = 'http://test-portal-services';
process.env.MEMBERSERVICE_CONTEXT_ROOT = '/MemberServiceWeb';
process.env.ES_API_URL = 'http://test-es-api';

// Mock auth token
jest.mock('../utils/api/getToken', () => ({
  getAuthToken: jest.fn().mockReturnValue('fake-auth-token'),
}));

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

// Mock global objects that might not be available in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.crypto for UUID generation and random values
if (!window.crypto) {
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'f7c4e4d0-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      getRandomValues: (buffer: Uint8Array) => {
        return crypto.getRandomValues(buffer);
      },
      subtle: {},
    },
  });
} else if (!window.crypto.randomUUID) {
  window.crypto.randomUUID = () => 'f7c4e4d0-1a2b-3c4d-5e6f-7a8b9c0d1e2f';
}

// Mock fetch API
global.fetch = jest.fn();

// Mock Audio API
global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Define types in a single declaration
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Ignoring TS errors in global declarations for testing environment
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeFocusable(): R;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Global {
      fetch: jest.Mock;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Audio: any;
      ResizeObserver: jest.Mock;
    }
  }

  interface Window {
    CobrowseIO?: {
      license: string;
      customData: {
        user_id: string;
        user_name: string;
      };
      capabilities: string[];
      confirmSession: () => Promise<boolean>;
      confirmRemoteControl: () => Promise<boolean>;
      start: () => Promise<void>;
      stop: () => Promise<void>;
      createSessionCode: () => Promise<string>;
    };
  }
}
