import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { type PortalUser } from './models/auth/user';
import { computeSessionUser } from './userManagement/computeSessionUser';
import { SessionUser } from './userManagement/models/sessionUser';
import { decodeVisibilityRules } from './visibilityEngine/converters';

export const SERVER_ACTION_NO_SESSION_ERROR = 'Invalid session';

declare module 'next-auth' {
  interface Session {
    user: PortalUser;
  }
}

const JWT_EXPIRY: number = parseInt(
  process.env.JWT_SESSION_EXPIRY_SECONDS || '1800',
);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  callbacks: {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars -- Token will be used for backend implementation but this is a stub for now
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token.user!,
          vRules: decodeVisibilityRules(
            (token.user as SessionUser).rules ?? '0',
          ),
        },
      };
    },
    async jwt({ token, session, trigger, user }) {
      //Append necessary additional JWT values here
      console.log('JWT callback', token, user);
      if (trigger == 'update') {
        console.log('JWT Update', session);
        const user = await computeSessionUser(
          token.sub!,
          session.userId,
          session.planId,
        );

        return {
          ...token,
          user,
        };
      }

      if (user) {
        return {
          ...token,
          user,
        };
      }
      return { ...token, ...session };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: JWT_EXPIRY,
  },
  jwt: {
    maxAge: JWT_EXPIRY,
  },
  ...authConfig,
});
