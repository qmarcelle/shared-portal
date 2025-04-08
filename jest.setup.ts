import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'test-user-id',
        currUsr: {
          umpi: 'test-umpi',
          role: 'member',
          firstName: 'Test',
          lastName: 'User',
          plan: {
            memCk: 'test-plan-id',
            grpId: 'test-group-id',
            subId: 'test-sub-id',
          },
        },
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  ),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'test-user-id',
        currUsr: {
          umpi: 'test-umpi',
          role: 'member',
          firstName: 'Test',
          lastName: 'User',
          plan: {
            memCk: 'test-plan-id',
            grpId: 'test-group-id',
            subId: 'test-sub-id',
          },
        },
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    status: 'authenticated',
  })),
  getSession: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'test-user-id',
        currUsr: {
          umpi: 'test-umpi',
          role: 'member',
          firstName: 'Test',
          lastName: 'User',
          plan: {
            memCk: 'test-plan-id',
            grpId: 'test-group-id',
            subId: 'test-sub-id',
          },
        },
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  ),
}));

// Mock window.Genesys
Object.defineProperty(window, 'Genesys', {
  value: {
    Chat: {
      createChatWidget: jest.fn(),
      updateUserData: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      endSession: jest.fn(),
    },
  },
  writable: true,
});

// Mock window.CobrowseIO
Object.defineProperty(window, 'CobrowseIO', {
  value: {
    license: '',
    customData: {},
    capabilities: [],
    confirmSession: jest.fn(),
    confirmRemoteControl: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    createSessionCode: jest.fn(),
  },
  writable: true,
});

// Add TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock fetch with more realistic chat responses
global.fetch = jest.fn((input: RequestInfo | URL) => {
  const url = input.toString();
  if (url.includes('/api/chat/eligibility')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          isEligible: true,
          reason: 'User is eligible for chat',
        }),
    } as Response);
  }
  if (url.includes('/api/chat/business-hours')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          isOpen24x7: false,
          days: [
            {
              day: 'Monday',
              openTime: '09:00',
              closeTime: '17:00',
              isOpen: true,
            },
            {
              day: 'Tuesday',
              openTime: '09:00',
              closeTime: '17:00',
              isOpen: true,
            },
            {
              day: 'Wednesday',
              openTime: '09:00',
              closeTime: '17:00',
              isOpen: true,
            },
            {
              day: 'Thursday',
              openTime: '09:00',
              closeTime: '17:00',
              isOpen: true,
            },
            {
              day: 'Friday',
              openTime: '09:00',
              closeTime: '17:00',
              isOpen: true,
            },
          ],
          timezone: 'America/New_York',
          isCurrentlyOpen: true,
        }),
    } as Response);
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
}) as jest.Mock;

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock crypto for UUID generation
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid',
    getRandomValues: <T extends ArrayBufferView | null>(array: T): T => {
      if (array === null) return array;
      const buffer = array.buffer as ArrayBuffer;
      const bytes = new Uint8Array(buffer);
      bytes.fill(0);
      return array;
    },
  },
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
