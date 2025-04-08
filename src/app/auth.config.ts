import { ChatSessionJWT } from '@/app/chat/models/types';
import { NextAuthConfig } from 'next-auth';

// Extend the built-in types
declare module 'next-auth' {
  interface User extends ChatSessionJWT {}
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends ChatSessionJWT {}
}

export const authConfig: NextAuthConfig = {
  providers: [], // Configure your auth providers here
  callbacks: {
    async jwt({ token, user }) {
      // Forward auth data from sign in to token
      if (user) {
        // Validate required fields
        if (!user.userID || !user.planId) {
          throw new Error('Missing required user data');
        }

        return {
          ...token,
          userID: user.userID,
          planId: user.planId,
          userRole: user.userRole || '',
          groupId: user.groupId || '',
          subscriberId: user.subscriberId || '',
          currUsr: {
            umpi: user.currUsr?.umpi || '',
            role: user.currUsr?.role || '',
            plan: {
              memCk: user.currUsr?.plan?.memCk || '',
              grpId: user.currUsr?.plan?.grpId || '',
              subId: user.currUsr?.plan?.subId || '',
            },
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Forward token data to client session
      if (!token.userID || !token.planId) {
        throw new Error('Invalid session token');
      }

      return {
        ...session,
        user: {
          ...session.user,
          userID: token.userID,
          planId: token.planId,
          userRole: token.userRole,
          groupId: token.groupId,
          subscriberId: token.subscriberId,
          currUsr: token.currUsr,
        },
      };
    },
  },
};
