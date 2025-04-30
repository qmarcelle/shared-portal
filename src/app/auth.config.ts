import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/error',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Here you would validate credentials against your auth service
        // For now, we'll use a simple validation
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // TODO: Replace with actual auth service call
        if (username === 'test' && password === 'test') {
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            currUsr: {
              role: 'member',
            },
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Forward auth data from sign in to token
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Forward token data to client session
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
};
