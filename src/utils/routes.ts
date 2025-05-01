/**
 * Routes that are accessible to non-logged-in clients.
 */
export const publicRoutes = ['/embed/logout', '/chat-test'];

/**
 * Routes that are used for authentication.
 * The routes will redirect logged-in users to /settings.
 */
export const authRoutes = ['/login', '/embed/dxAuth'];

/**
 * Context root for API authentication routes.
 */
export const apiAuthPrefix = '/api';

/**
 * Mapping of inbound SSO authentication paths to the portal page they redirect to upon successful sign-in
 */
export const inboundSSORoutes = new Map<string, string>([
  ['/embed/dxAuth', '/embed/security'],
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
];

export const SECURITY_SETTINGS_PATH = '/security';

export const DEFAULT_LOGOUT_REDIRECT = '/login';

export const ROUTES_WITHOUT_HEADER_FOOTER = [
  '/login',
  '/error',
  '/maintenance',
  '/embed',
];

/**
 * Common routes that are shared across all groups
 */
export const commonRoutes = {
  myPlan: '/myplan',
  benefits: '/benefits',
  profile: '/profile',
  sharing: '/sharing',
};

/**
 * Group-specific routes that can be overridden
 */
export const groupRoutes = {
  dashboard: '/dashboard',
  findCare: '/findcare',
  myHealth: '/myhealth',
  support: '/support',
};

/**
 * Check if a route should hide header and footer
 */
export function shouldHideHeaderFooter(pathname: string): boolean {
  return ROUTES_WITHOUT_HEADER_FOOTER.some((route) =>
    pathname.startsWith(route),
  );
}

/**
 * Check if a route is group-specific
 */
export function isGroupRoute(pathname: string): boolean {
  return Object.values(groupRoutes).some((route) =>
    pathname.startsWith(route),
  );
}

/**
 * Get the group from the pathname
 */
export function getGroupFromPath(pathname: string): string {
  const parts = pathname.split('/');
  return parts[1] || 'member';
}