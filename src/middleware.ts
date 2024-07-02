import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from './utils/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  console.log(`ROUTE ${req.nextUrl.pathname} loggedIn=${isLoggedIn}`);
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log(`Redirecting logged-in client to ${DEFAULT_LOGIN_REDIRECT}`);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isPublicRoute) {
    if (isLoggedIn && process.env.WPS_REDIRECT_ENABLED == 'true') {
      // TODO TAI Redirect goes here
    } else if (!isLoggedIn) {
      console.log('Redirecting logged-out client to /auth/login');
      return Response.redirect(new URL('/auth/login', nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
/**
 * This matcher is supplied with the NextAuth documentation, but has been known to have issues.
 * The matcher in-use was supplied by Code with Antonio's NextAuth tutorial and appears to work just as well.
 */
const nextAuthMatcher = '/((?!api|_next/static|_next/image|favicon.ico).*)';
