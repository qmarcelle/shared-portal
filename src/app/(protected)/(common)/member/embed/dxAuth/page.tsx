/**
 * embed/dxAuth
 * Dx auth
 */
export const metadata = {
  title: 'Dx auth | Consumer Portal',
  description: 'Dx auth'
};

'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { dxAuth } from './actions/dxAuth';

async function initializeDXPortalAuth(token: string | null) {
  await dxAuth(token);
}

const SecurityDXAuthPage = () => {
  const token = useSearchParams().get('u');
  const router = useRouter();
  useEffect(() => {
    initializeDXPortalAuth(token);
    router.replace('/embed/security');
  });

  return <div>Just a moment, loading your account settings... </div>;
};

export default SecurityDXAuthPage;
