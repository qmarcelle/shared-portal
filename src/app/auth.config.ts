import { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [], // Configure your auth providers here
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
};
