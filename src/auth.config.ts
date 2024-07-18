import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PortalUser } from './models/auth/user';
import { getPersonBusinessEntity } from './utils/api/client/get_pbe';

class AuthError extends CredentialsSignin {
  code =
    "We're sorry, we weren't able to authenticate your account due to an unknown error. Please try again later."; //eslint-disable-line quotes
}

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
      async authorize(credentials): Promise<PortalUser> {
        const username = credentials.userId?.toString();
        if (!username) {
          console.error(
            'Tried to create session with an empty username. Something is very wrong!',
          );
          throw new AuthError();
        }
        try {
          const user = await getPersonBusinessEntity(username);
          return user;
        } catch (error) {
          console.error('Failed to create user session!');
          console.error(error);
          throw new AuthError();
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
