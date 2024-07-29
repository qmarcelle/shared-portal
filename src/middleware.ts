import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  getLoginRedirect,
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

  /**
   * Handle inbound SSO routes.
   * If the user is not logged in, return to prevent handling of the route by any other part of the function.
   * If logged in already, redirect to the destination page specified in routes.ts
   */
  if (isInboundSSO) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(
          inboundSSORoutes.get(nextUrl.pathname) || '/dashboard',
          nextUrl,
        ),
      );
    } else {
      return;
    }
  }

  /**
   * Routes for the login flow.
   * Already logged-in users should be redirected to the dashboard.
   */
  if (isLoggedIn) {
    if (
      process.env.NEXT_PUBLIC_WPS_REDIRECT_ENABLED == 'true' &&
      !nextUrl.pathname.includes('/embed')
    ) {
      console.log('Redirecting app user to WebSphere');
      return Response.redirect(
        new URL(process.env.NEXT_PUBLIC_WPS_REDIRECT_URL || '/', nextUrl),
      );
    }
    if (isAuthRoute) {
      const redir = getLoginRedirect();
      console.log(`Redirecting logged-in client to ${redir}`);
      return Response.redirect(new URL(redir, nextUrl));
    }
    return;
  }

  if (isAuthRoute && !isLoggedIn) {
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
