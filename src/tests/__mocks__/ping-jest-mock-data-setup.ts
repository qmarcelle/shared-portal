import { jest } from '@jest/globals';
jest.mock('next/headers', () => {
  return {
    headers: () => {
      return {
        get: (ipAddress: string) => {
          // Return the mocked value based on the header name
          if (ipAddress === 'x-forwarded-for') {
            return '1';
          }
          return undefined;
        },
      };
    },
  };
});

jest.mock('next/server', () => ({
  userAgent: jest.fn(() => ({
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent
  })),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).window = global.window || {};
window._pingOneSignals = {
  getData: jest.fn<() => Promise<string>>(() => Promise.resolve('Testing')),
  initSilent: jest.fn<() => Promise<void>>(() => Promise.resolve()),
};
window._pingOneSignalsReady = true;

process.env.ES_PORTAL_SVCS_API_URL = 'ES_PORTAL_SVCS_API_URL';
