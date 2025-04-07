import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { computeSessionUser } from './userManagement/computeSessionUser';
import { SessionUser } from './userManagement/models/sessionUser';
import { logger } from './utils/logger';

class AuthError extends CredentialsSignin {
  code =
    "We're sorry, we weren't able to authenticate your account due to an unknown error. Please try again later."; //eslint-disable-line quotes
}

const JWT_EXPIRY: number = parseInt(
  process.env.JWT_SESSION_EXPIRY_SECONDS || '1800',
);

/**
 * This NextAuth provider does NOT process authentication!
 * Credentials checks and MFA are handled by server actions prior to this step.
 * This provider serves only to create the user session and JWT.
 */
export default {
  providers: [
    Credentials({
      credentials: {
        userId: { label: 'User ID' },
      },
      async authorize(credentials): Promise<SessionUser> {
        const username = credentials.userId?.toString();
        if (!username) {
          logger.error(
            'Tried to create session with an empty username. Something is very wrong!',
          );
          throw new AuthError();
        }
        try {
          const user = await computeSessionUser(username);
          return user;
        } catch (err) {
          console.log(`computeSessionUser failure username=${username}`);
          console.error(err);
          throw new AuthError();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: JWT_EXPIRY,
  },
  jwt: {
    maxAge: JWT_EXPIRY,
  },
  cookies: {
    sessionToken: {
      name: 'BCBSTMemberSessionToken',
      options: {
        maxAge: JWT_EXPIRY,
        secure: true,
        httpOnly: true,
      },
    },
  },
} satisfies NextAuthConfig;
