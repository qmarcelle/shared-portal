/**
 * Routes that are accessible to non-logged-in clients.
 */
export const publicRoutes = ['/'];

/**
 * Routes that are used for authentication.
 * The routes will redirect logged-in users to /settings.
 */
export const authRoutes = ['/login'];

/**
 * Context root for API authentication routes.
 */
export const apiAuthPrefix = '/api';

export const SECURITY_SETTINGS_PATH = '/security';

export const DEFAULT_LOGIN_REDIRECT = process.env.WPS_REDIRECT_URL || '';
