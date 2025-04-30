import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { computeSessionUser } from './userManagement/computeSessionUser';
import { SessionUser } from './userManagement/models/sessionUser';

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
      async authorize(credentials): Promise<SessionUser> {
        const username = credentials.userId?.toString();
        if (!username) {
          console.error(
            'Tried to create session with an empty username. Something is very wrong!',
          );
          throw new AuthError();
        }
        try {
          const user = await computeSessionUser(username);
          return user;
        } catch (err) {
          console.log('Authorization failed');
          throw new AuthError();
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as SessionUser;
      return session;
    },
  },
} satisfies NextAuthConfig;
