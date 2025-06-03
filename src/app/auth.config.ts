// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// — your real providers —
// import PingProvider from 'next-auth/providers/ping';
// import SSOProvider  from 'next-auth/providers/your-sso';

export const authConfig: NextAuthConfig = {
  providers: [
    // 1️⃣ Dev‐only auto‐login
    ...(process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
      ? [
          CredentialsProvider({
            id: 'dev-login',
            name: 'Dev Login (mock)',
            credentials: {},
            async authorize() {
              // return whatever shape your app expects on session.user
              return {
                id: 'mock-user-1',
                name: 'Local Dev',
                email: 'dev@local.test',
              };
            },
          }),
        ]
      : []),

    // 2️⃣ Real providers (only when mocks are OFF)
    ...(process.env.NEXT_PUBLIC_USE_MOCKS !== 'true'
      ? [
          // PingProvider({ /* ...ping options... */ }),
          // SSOProvider({ /* ...sso options... */ }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },

  // any other NextAuth options you already had...
};

export default NextAuth(authConfig);