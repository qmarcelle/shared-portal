import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { type PortalUser } from './models/auth/user';

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
      return session;
    },
    async jwt({ token }) {
      //Append necessary additional JWT values here
      if (token.sub) {
      }

      return token;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
