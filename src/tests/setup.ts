/**
 * Jest test setup file - configures the test environment
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

// Set up MSW server for tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());
