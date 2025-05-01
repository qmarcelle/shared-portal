/**
 * embed/logout
 * Logout
 */
export const metadata = {
  title: 'Logout | Consumer Portal',
  description: 'Logout'
};

/**
 * This page should NOT be used for logout from within refreshed portal!
 * This page is only to be used by PingOne to logout the user from next-auth when the logout flow is initiated from WAS.
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginStore } from '../../login/stores/loginStore';

const LogoutPage = () => {
  const router = useRouter();
  const targetResource = useSearchParams().get('TargetResource');
  const { signOut } = useLoginStore();
  useEffect(() => {
    const logout = async () => {
      await signOut();
      const redirectUrl: string =
        (process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || '/login') +
        (targetResource && `?TargetResource=${targetResource}`);
      router.replace(redirectUrl);
    };
    logout();
  });

  return <div>Just a moment... </div>;
};

export default LogoutPage;
