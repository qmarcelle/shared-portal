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

export const DEFAULT_LOGIN_REDIRECT = '/member/home';
export const DEFAULT_LOGOUT_REDIRECT = '/login';
