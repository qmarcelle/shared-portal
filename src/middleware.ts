import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  inboundSSORoutes,
  publicRoutes,
} from './utils/routes';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  console.log(`ROUTE ${req.nextUrl.pathname} loggedIn=${isLoggedIn}`);
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isInboundSSO = inboundSSORoutes.has(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  //Redirect to security for the DX iframe flow
  if (isInboundSSO && isLoggedIn) {
    return Response.redirect(
      new URL(inboundSSORoutes.get(nextUrl.pathname) || '/dashboard', nextUrl),
    );
  }

  /**
   * Routes for the login flow.
   * Already logged-in users should be redirected to the dashboard.
   */
  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log(`Redirecting logged-in client to ${DEFAULT_LOGIN_REDIRECT}`);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  /**
   * Routes accessible by logged-in users.
   */
  if (!isPublicRoute) {
    if (!isLoggedIn) {
      console.log('Redirecting logged-out client to /login');
      return Response.redirect(new URL('/login', nextUrl));
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
 
const nextAuthMatcher = '/((?!api|_next/static|_next/image|favicon.ico).*)';
*/
