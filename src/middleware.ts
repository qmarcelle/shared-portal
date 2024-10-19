import NextAuth from 'next-auth';
import authConfig from './auth.config';
import {
  apiAuthPrefix,
  authRoutes,
  inboundSSORoutes,
  publicRoutes,
} from './utils/routes';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const method = req.method;
  console.log(`${method} ${req.nextUrl.pathname} loggedIn=${isLoggedIn}`);
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
      console.log('Skipped POST request check due to no form data.');
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
      const redir = process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard';
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
