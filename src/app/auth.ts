import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const isOnSSOPage = nextUrl.pathname.startsWith('/sso');

      if (isOnLoginPage || isOnSSOPage) {
        if (isLoggedIn)
          return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
});
