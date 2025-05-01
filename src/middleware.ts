import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/myPlan',
  '/benefits',
  '/claims',
  '/findcare',
  '/chat',
  '/security',
  '/profileSettings',
  '/personalRepresentativeAccess',
];

// Define SSO routes that need special handling
const ssoRoutes = ['/sso/launch', '/sso/redirect'];

// Define special paths that should not be processed by the middleware
const excludedPaths = ['/api', '/_next', '/favicon.ico', '/public'];

export async function middleware(request: NextRequest) {
  // Skip processing for excluded paths
  const path = request.nextUrl.pathname;
  if (excludedPaths.some((excludedPath) => path.startsWith(excludedPath))) {
    return NextResponse.next();
  }

  // Handle group-based URL rewriting for /member/ paths (ADR-001)
  if (path.startsWith('/member/')) {
    const url = request.nextUrl.clone();
    let group = 'member'; // Default group

    // Determine group based on JWT token audience claim
    const token = request.cookies.get('next-auth.session-token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
        );

        // Handle both string and array audience values
        const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

        // Map audience claims to specific groups
        if (aud.includes('bcbst:bluecare')) group = 'bluecare';
        else if (aud.includes('bcbst:amplify')) group = 'amplify';
        else if (aud.includes('bcbst:provider')) group = 'provider';
      } catch (error) {
        console.error('JWT verification failed:', error);
        // Continue with default 'member' group
      }
    }

    // Rewrite URL: '/member/path' -> '/{group}/path'
    url.pathname = `/${group}${path.slice(7)}`;
    return NextResponse.rewrite(url);
  }

  // Handle SSO routes
  if (ssoRoutes.some((route) => path.startsWith(route))) {
    // Validate SSO parameters and handle redirects
    const searchParams = request.nextUrl.searchParams;
    const partnerId = searchParams.get('PartnerSpId');

    if (!partnerId) {
      return NextResponse.redirect(
        new URL('/error?code=invalid_sso', request.url),
      );
    }

    // Verify JWT audience for SSO
    const token = request.cookies.get('next-auth.session-token')?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
        );
        if (payload.aud !== partnerId) {
          return NextResponse.redirect(
            new URL('/error?code=invalid_audience', request.url),
          );
        }
      } catch (error) {
        return NextResponse.redirect(
          new URL('/error?code=invalid_token', request.url),
        );
      }
    }

    return NextResponse.next();
  }

  // Check if the path is protected
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    // Check for auth token - if not present, redirect to login
    const token = request.cookies.get('next-auth.session-token')?.value;
    if (!token) {
      // Redirect to login page with return URL
      const url = new URL('/login', request.url);
      url.searchParams.set('returnUrl', path);
      return NextResponse.redirect(url);
    }

    try {
      // Verify token is valid
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
      );

      // Check role-based access for specific routes
      if (
        path.startsWith('/security') ||
        path.startsWith('/personalRepresentativeAccess')
      ) {
        const userRole = payload.role as string;
        if (!userRole || !checkPersonalRepAccess(userRole)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      // Invalid token, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('returnUrl', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Helper function to check personal rep access
function checkPersonalRepAccess(role: string): boolean {
  return ['member', 'admin'].includes(role.toLowerCase());
}

// Configure middleware matching
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
