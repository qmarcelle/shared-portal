import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

// Export the server instance and its methods
export { server };
export const { listen, close, resetHandlers } = server;
