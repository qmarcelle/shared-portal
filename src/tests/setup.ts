process.env.PORTAL_SERVICES_URL = 'PORTAL_SVCS_URL';
process.env.MEMBERSERVICE_CONTEXT_ROOT = '/MEM_SVC_CONTEXT';
process.env.ES_API_URL = 'ES_SVC_URL';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
      push: () => null,
      refresh: () => null,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '/dashboard';
  },
}));

// Bearer Token Mock
jest.mock('src/utils/api/getToken', () => ({
  getAuthToken: jest.fn(() => {
    return 'BearerTokenMockedValue';
  }),
}));

export const mockedFetch = jest.fn();
global.fetch = mockedFetch;
