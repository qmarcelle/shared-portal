// Workaround for missing msw/node module
// @ts-expect-error - Module 'msw/node' cannot be found but it's required for testing
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);

// Export the server instance and its methods
export const { listen, close, resetHandlers } = server;
