/**
 * Jest test setup file - configures the test environment
 * This is a consolidated setup file combining previous setup.ts and jest-setup.ts
 */

// Import testing libraries
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

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
      // Format the UUID to match the expected format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      randomUUID: () => 'f7c4e4d0-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
      getRandomValues: () => new Uint32Array(10).fill(1),
      subtle: {},
    },
  });
} else if (!window.crypto.randomUUID) {
  // Format the UUID to match the expected format
  window.crypto.randomUUID = () => 'f7c4e4d0-1a2b-3c4d-5e6f-7a8b9c0d1e2f';
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

// Mock matchMedia - consolidated from different files
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

// Set up MSW server for tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset handlers and mocks after each test (consolidated)
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});

// Clean up after tests are complete
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
