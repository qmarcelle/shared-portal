// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getRouteConfig, getAppropriatePathForUser } from './src/lib/routing/route-config';
// import { getToken } from 'next-auth/jwt';

// /**
//  * Middleware for handling URL routing, permissions, and conditional path selection
//  */
// export async function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   const pathname = url.pathname;
  
//   // Skip middleware for Next.js internal routes, API routes and static files
//   if (
//     pathname.startsWith('/_next') || 
//     pathname.startsWith('/api/') ||
//     pathname.includes('.') ||
//     pathname === '/favicon.ico'
//   ) {
//     return NextResponse.next();
//   }

//   // Get the auth token (session) from the request
//   const token = await getToken({ req: request });
  
//   // If route is authenticated but no token exists, redirect to login
//   if (!token && pathname !== '/login' && !pathname.startsWith('/api/auth')) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Get user data from token or additional API calls if needed
//   // This could come from the token claims or you could make an additional
//   // API call here to get more detailed user data
//   const userData = token?.userData || {};
  
//   // Get route configuration based on the path
//   const routeConfig = getRouteConfig(pathname, userData);
  
//   // If no route config exists, continue (may be an unregistered route)
//   if (!routeConfig) {
//     // For unregistered routes starting with /member/, redirect to dashboard
//     if (pathname.startsWith('/member/')) {
//       url.pathname = '/dashboard';
//       return NextResponse.rewrite(url);
//     }
//     return NextResponse.next();
//   }
  
//   // Check access and get appropriate path for this user
//   const appropriatePath = getAppropriatePathForUser(routeConfig, token as any, userData);
  
//   // If path is different from the internalPath, user needs a variant or doesn't have access
//   if (appropriatePath !== routeConfig.internalPath) {
//     // Check if this is an unauthorized fallback
//     if (!hasRouteAccess(routeConfig, token as any, userData)) {
//       const response = NextResponse.redirect(new URL(appropriatePath, request.url));
//       response.headers.set('x-access-denied', 'true');
//       return response;
//     }
    
//     // Otherwise it's a variant route, so rewrite
//     url.pathname = appropriatePath;
//     const response = NextResponse.rewrite(url);
//     response.headers.set('x-original-path', pathname);
//     response.headers.set('x-route-variant', 'true');
//     return response;
//   }
  
//   // Standard path rewrite
//   url.pathname = routeConfig.internalPath;
//   const response = NextResponse.rewrite(url);
  
//   // Store original URL for breadcrumb navigation
//   response.headers.set('x-original-path', pathname);
  
//   // If it's a deprecated route, add a header to track usage
//   if (routeConfig.deprecated) {
//     response.headers.set('x-deprecated-route', 'true');
//   }

//   return response;
// }

// /**
//  * Configure which paths the middleware runs on
//  */
// export const config = {
//   matcher: [
//     // Match all paths except static files, api routes and images
//     '/((?!_next/static|_next/image|favicon.ico|images).*)',
//   ],
// };

// // Import the missing function from the route config
// import { hasRouteAccess } from './src/lib/routing/route-config';