/**
 * Routes that are accessible to non-logged-in clients.
 */
export const publicRoutes = ['/embed/logout'];

/**
 * Routes that are used for authentication.
 * The routes will redirect logged-in users to /settings.
 */
export const authRoutes = ['/login', '/embed/dxAuth', '/sso/impersonate'];

/**
 * Context root for API authentication routes.
 */
export const apiAuthPrefix = '/api';

/**
 * Mapping of inbound SSO authentication paths to the portal page they redirect to upon successful sign-in
 * (Unless a TargetResource parameter is specified)
 */
export const inboundSSORoutes = new Map<string, string>([
  ['/embed/dxAuth', '/embed/security'],
  ['/sso/impersonate', '/dashboard'],
  ['/sso/auth', '/dashboard'],
  ['/sso', '/sso'],
]);

/**
 * Routes that the root layout will not display the header and footer on.
 */
export const noHeaderAndFooterRoutes = [
  '/login',
  '/embed/security',
  '/embed/logout',
  '/',
  '/sso/auth',
  '/sso/impersonate',
];

export const SECURITY_SETTINGS_PATH = '/security';

export const DEFAULT_LOGOUT_REDIRECT = '/login';
