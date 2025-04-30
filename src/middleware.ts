import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';

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

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authConfig);

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

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
    if (!session) {
      // Redirect to login page with return URL
      const url = new URL('/login', request.url);
      url.searchParams.set('returnUrl', path);
      return NextResponse.redirect(url);
    }

    // Check role-based access for specific routes
    if (
      path.startsWith('/security') ||
      path.startsWith('/personalRepresentativeAccess')
    ) {
      const userRole = session.user?.currUsr?.role;
      if (!userRole || !checkPersonalRepAccess(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
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
