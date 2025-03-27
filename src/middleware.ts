import NextAuth from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  inboundSSORoutes,
  publicRoutes,
} from './utils/routes';

const { auth } = NextAuth(authConfig);

const getLoginDeeplinkRedirect = function (nextUrl: NextURL) {
  const path = nextUrl.pathname;
  if (!path || path == '/' || path == '/dashboard') {
    return Response.redirect(new URL('/login', nextUrl));
  } else {
    const encodedTargetResource = encodeURIComponent(path);
    return Response.redirect(
      new URL(`/login?TargetResource=${encodedTargetResource}`, nextUrl),
    );
  }
};

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const routeUser = isLoggedIn
    ? req.auth?.user.name || 'unknown'
    : 'unauthenticated';
  const method = req.method;
  console.log(`Router <${routeUser}> ${method} ${req.nextUrl.pathname}`);
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isInboundSSO = inboundSSORoutes.has(nextUrl.pathname);

  /* Handle POST call from public site
   * This will NOT autofill the username field. It just redirects the POST call to a GET to prevent the app from confusing it for a server action call.
   */
  if (req.method == 'POST' && nextUrl.pathname == '/login') {
    try {
      const formData = await req.formData();
      if (formData.get('accountType')) {
        return Response.redirect(new URL('/login', nextUrl));
      }
    } catch (err) {
      //If this block throws an error, it just means there's no form data - probably a server action call.
    }
  }

  /**
   * Handle requests to the root of the application (/)
   * There is no content here. It should redirect to the default login landing if already logged in, or to the login page if not.
   */
  if (nextUrl.pathname == '/') {
    return Response.redirect(
      new URL(
        (isLoggedIn ? process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL : '/login') ||
          '/dashboard',
        nextUrl,
      ),
    );
  }

  /**
   * Handle API routes
   */
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
   * Handle login flow routes
   * Already logged-in users should be redirected to the dashboard.
   */
  if (isAuthRoute) {
    if (isLoggedIn) {
      let redir;
      const targetResource = nextUrl.searchParams.get('TargetResource');
      if (targetResource) {
        redir = decodeURIComponent(targetResource);
      } else {
        redir = process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard';
      }
      console.log(`Redirecting logged-in client to ${redir}`);
      return Response.redirect(new URL(redir, nextUrl));
    } else {
      return;
    }
  }

  /**
   * Handle logged-in traffic when HCL redirect is enabled
   */
  if (
    process.env.WPS_REDIRECT_ENABLED == 'true' &&
    isLoggedIn &&
    !nextUrl.pathname.includes('/embed')
  ) {
    console.log('Redirecting logged-in user to WebSphere');
    return Response.redirect(
      new URL(process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/', nextUrl),
    );
  }

  /**
   * Routes accessible by logged-in users.
   */
  if (!isPublicRoute) {
    if (!isLoggedIn) {
      console.log('Redirecting logged-out client to /login');
      return getLoginDeeplinkRedirect(nextUrl);
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
