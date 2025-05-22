import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { type PortalUser } from './models/auth/user';
import { computeSessionUser } from './userManagement/computeSessionUser';
import { SessionUser } from './userManagement/models/sessionUser';
import { logger } from './utils/logger';
import { decodeVisibilityRules } from './visibilityEngine/converters';

export const SERVER_ACTION_NO_SESSION_ERROR = 'Invalid session';

declare module 'next-auth' {
  interface Session {
    user: PortalUser;
  }
}

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
      const sessionToReturn = {
        ...session,
        user: {
          ...session.user,
          ...token.user!,
          vRules: decodeVisibilityRules(
            (token.user as SessionUser).rules ?? '0',
          ),
        },
      };
      // Log the session object that will be returned to the client via /api/auth/session
      logger.info(
        '[auth.ts] Session callback: Final session object being returned to client:',
        sessionToReturn,
      );
      return sessionToReturn;
    },
    async jwt({ token, session, trigger, user }) {
      //Append necessary additional JWT values here
      console.log('JWT callback invoked', {
        trigger,
        userIsPresent: !!user,
        existingTokenUserIsPresent: !!token.user,
        currentSub: token.sub,
      });

      if (trigger == 'update') {
        console.log('JWT Update triggered', {
          sessionData: session,
          currentTokenSub: token.sub,
        });
        const computedUser = await computeSessionUser(
          token.sub!, // Assumes token.sub is the username/primary ID for computeSessionUser
          session.userId, // This should be the UMPI from unstable_update payload
          session.planId, // This is the planId from unstable_update payload
          session.impersonator,
        );

        return {
          ...token,
          user: computedUser, // Overwrite token.user with the new SessionUser from compute
        };
      }

      if (user) {
        console.log(
          'JWT: Initial sign-in or user passed. Assigning to token.user.',
          { userFromAuthorize: user },
        );
        // 'user' from authorize in auth.config.ts is already a SessionUser
        return {
          ...token,
          user: user as SessionUser, // Explicitly cast if needed, but should be SessionUser
        };
      }

      // If user is not present, and it's not an update, just return the existing token.
      // This could be a token refresh/validation call where only the token is passed.
      console.log(
        'JWT: No new user info, not an update. Returning existing token.',
        { currentTokenUser: token.user },
      );
      return token; // Return the token as is (removed ...session spread)
    },
  },
  ...authConfig,
});
