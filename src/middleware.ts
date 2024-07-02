import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
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
      console.log(
        `Redirecting logged-in user ${req.auth.user.userName} to WebSphere`,
      );
      const headers = new Headers(req.headers);
      headers.set('X-MemberPortal-Auth-Token', JSON.stringify(req.auth.user)); //TODO this will send the UNENCRYPTED user session! We need to figure out how to send the encrypted JWT here. This is for testing purposes only!!!
      const options = {
        request: {
          headers: headers,
        },
      };
      NextResponse.rewrite(process.env.WPS_REDIRECT_URL, options);
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
