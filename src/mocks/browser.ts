import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { createRestHandler } from './restHandlers';

/**
 * MSW worker setup for browser environment
 * This enables mocking API requests in development environment
 */

// Convert the handlers to the expected format for MSW 2.x
const restHandlers = handlers.map((handler) =>
  createRestHandler(handler.method, handler.url, handler.resolver),
);

// This configures a service worker with the given request handlers
export const worker = setupWorker(...restHandlers);

/**
 * Initialize MSW in development mode only
 */
export async function initMSW() {
  if (process.env.NODE_ENV === 'development') {
    // Start the worker
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    });

    console.log('[MSW] Mock Service Worker initialized');
  }
}
