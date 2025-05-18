'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { impersonate } from '../actions/impersonate';

async function initializeImpersonation(token: string | null) {
  await impersonate(token);
}

const ImpersonationDropoffPage = () => {
  const queryParams = useSearchParams();
  const token = queryParams.get('req');
  const router = useRouter();
  useEffect(() => {
    const runImpersonation = async () => {
      await initializeImpersonation(token);
      router.replace(
        process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || '/dashboard',
      );
    };
    runImpersonation();
  }, [token, router]);

  return <div>Just a moment...</div>;
};

export default ImpersonationDropoffPage;
