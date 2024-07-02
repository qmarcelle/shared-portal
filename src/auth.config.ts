import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getPersonBusinessEntity } from './utils/api/client/get_pbe';

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
      async authorize(credentials) {
        try {
          const user = await getPersonBusinessEntity(
            credentials.userId.toString(),
          );
          return user;
        } catch (error) {}
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
