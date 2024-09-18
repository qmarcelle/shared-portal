/**
 * This page should NOT be used for logout from within refreshed portal!
 * This page is only to be used by PingOne to logout the user from next-auth when the logout flow is initiated from WAS.
 */

'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginStore } from '../../login/stores/loginStore';

const LogoutPage = () => {
  const router = useRouter();
  const { signOut } = useLoginStore();
  useEffect(() => {
    const logout = async () => {
      await signOut();
      router.replace(process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || '/login');
    };
    logout();
  });

  return <div>Just a moment... </div>;
};

export default LogoutPage;
