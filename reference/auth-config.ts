// lib/auth/auth.ts
import NextAuth from 'next-auth';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { memberClient } from '@/lib/clients/member/memberClient';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = nextUrl.pathname.startsWith('/(protected)');
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenant = user.tenant;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenant = token.tenant as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'BCBST',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Call your authentication service API
          const user = await memberClient.authenticate({
            username: credentials.username,
            password: credentials.password
          });
          
          return user;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// lib/auth/session.ts
import { auth } from '@/lib/auth/auth';

/**
 * Get the current user session
 */
export async function getSession() {
  return await auth();
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// middleware.ts - Root middleware for authentication
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getTenantFromUrl } from '@/lib/utils/tenant';

export default auth(async function middleware(req) {
  const session = await auth();
  const { nextUrl } = req;
  
  // Get tenant from URL
  const tenant = getTenantFromUrl(nextUrl);
  
  // For authenticated users, check tenant access if going to tenant-specific route
  if (session && tenant) {
    const hasAccess = await checkTenantAccess(session.user, tenant);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// For auth.js api route
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth/auth';

export const { GET, POST } = handlers;
