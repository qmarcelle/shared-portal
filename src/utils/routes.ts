/**
 * Routes that are accessible to non-logged-in clients.
 */
export const publicRoutes = ['/'];

/**
 * Routes that are used for authentication.
 * The routes will redirect logged-in users to /settings.
 */
export const authRoutes = ['/login', '/security/dxAuth'];

/**
 * Context root for API authentication routes.
 */
export const apiAuthPrefix = '/api';

/**
 * Mapping of inbound SSO authentication paths to the portal page they redirect to upon successful sign-in
 */
export const inboundSSORoutes = new Map<string, string>([
  ['/embed/dxAuth', '/embed/security'],
]);

export const SECURITY_SETTINGS_PATH = '/security';

export const DEFAULT_LOGOUT_REDIRECT = '/login';
