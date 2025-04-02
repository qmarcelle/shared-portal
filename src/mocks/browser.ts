import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker setup for browser environment
 * This enables mocking API requests in development environment
 */

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers);

/**
 * Initialize MSW in development mode only
 */
export async function initMSW() {
  if (process.env.NODE_ENV === 'development') {
    // Start the worker
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: { scope: '/' },
      },
    });

    console.log('[MSW] Mock Service Worker initialized');
  }
}
