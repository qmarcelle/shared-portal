import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { type PortalUser } from './models/auth/user';
import { getPersonBusinessEntity } from './utils/api/client/get_pbe';

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
} = NextAuth({
  callbacks: {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars -- Token will be used for backend implementation but this is a stub for now
    async session({ token, session }) {
      if (token.sub) {
        session.user = await getPersonBusinessEntity(token.sub); //If this is called on every page load then we should probably cache this in Mongo
      }
      return session;
    },
    async jwt({ token }) {
      //Append necessary additional JWT values here
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.JWT_SESSION_EXPIRY_SECONDS || '1800'),
  },
  ...authConfig,
});
