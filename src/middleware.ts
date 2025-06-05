import NextAuth, { Session } from 'next-auth';
import { getToken, JWT } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';
import { WPS_REDIRECTS } from './lib/wps_redirects';
import { SessionUser } from './userManagement/models/sessionUser';
import { API_BASE_PATH } from './utils/routes';
import { getRoutingRedirect, getURLRewrite } from './utils/routing';
import { decodeVisibilityRules } from './visibilityEngine/converters';

const { auth } = NextAuth(authConfig);

const getRouteUser = function (session: Session | null): string {
  if (session) {
    if (session.user.impersonator) {
      return `${session.user.impersonator}::${session.user.id}`;
    } else {
      return session.user.id || 'unknown';
    }
  } else {
    return 'unauthenticated';
  }
};

/**
 * Allows retrieval of full session data in middleware, which is necessary for PZN checks on routing
 */
const getSession = function (token: JWT, session: Session) {
  return {
    ...session,
    user: {
      ...session.user,
      ...token.user!,
      vRules: decodeVisibilityRules((token.user as SessionUser).rules ?? '0'),
    },
  };
};

/**
 * Return a redirect to a new URL, preserving any query parameters in the original request
 * @param path 
 * @param oldUrl 
 * @returns 
 */
const redirectWithQueryString = (path: string, oldUrl: URL): Response => {
  const newUrl = new URL(path, oldUrl);
  if (oldUrl.search) {
    if (!newUrl.search) {
      newUrl.search = oldUrl.search;
    } else {
      oldUrl.searchParams.forEach((key, val) => newUrl.searchParams.append(key, val));
    }
  }
  return Response.redirect(newUrl);
}

export default auth(async (req) => {
  const { method, nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const wpsRedirect = WPS_REDIRECTS[nextUrl.pathname];
  if (wpsRedirect) {
    return redirectWithQueryString(wpsRedirect, nextUrl);
  }
  let session = null;
  if (isLoggedIn) {
    const jwt = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      cookieName: 'BCBSTMemberSessionToken',
    });
    if (jwt) {
      session = getSession(jwt, req.auth!);
    }
  }

  //console.log(`MW session=${JSON.stringify(session)}`);

  const routeUser = getRouteUser(session);
  console.log(`Router <${routeUser}> ${method} ${nextUrl.pathname}`);
  //We check for a rewrite here so we can check the PZN/breadcrumb logic against the internal URL path, then return the rewrite at the end
  const rewrite = getURLRewrite(nextUrl.pathname, session?.user?.vRules);
  if (rewrite) console.log(`Rewrite URL ${nextUrl.pathname} -> ${rewrite}`);
  const path = rewrite || nextUrl.pathname;
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_BASE_PATH);

  /**
   * Handle API routes
   */
  if (isApiAuthRoute) {
    return;
  }

  /* Handle POST call from public site
   * This will NOT autofill the username field. It just redirects the POST call to a GET to prevent the app from confusing it for a server action call.
   */
  if (req.method == 'POST' && path == '/login') {
    try {
      const formData = await req.formData();
      if (formData.get('accountType')) {
        return Response.redirect(new URL('/login', nextUrl));
      }
    } catch (err) {
      //If this block throws an error, it just means there's no form data - probably a server action call.
    }
  }

  const redirect = getRoutingRedirect(path, session);
  //console.log(`[DEBUG] redirect ${nextUrl.pathname} -> ${redirect}`);
  //const redirect = null;
  if (redirect) {
    if (redirect == nextUrl.pathname) {
      return Response.redirect('/error'); //Failsafe to prevent infinite redirect loops in unusual circumstances.
    } else if (
      redirect == '/login' &&
      path != '/' &&
      path != (process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard')
    ) {
      const targetResource = nextUrl.pathname + nextUrl.search;
      const encoded = encodeURIComponent(targetResource);
      return Response.redirect(
        new URL(`/login?TargetResource=${encoded}`, nextUrl),
      );
    } else {
      return redirectWithQueryString(redirect, nextUrl);
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

  if (rewrite) {
    const originalPath = nextUrl.pathname;
    nextUrl.pathname = rewrite;
    const response = NextResponse.rewrite(nextUrl);
    response.headers.set('x-orginal-path', originalPath);
    return response;
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
