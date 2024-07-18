'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { dxAuth } from './actions/dxAuth';

async function initializeDXPortalAuth(token: string | null) {
  await dxAuth(token);
}

const SecurityDXAuthPage = () => {
  const token = useSearchParams().get('u');
  useEffect(() => {
    initializeDXPortalAuth(token);
  });

  return <div>Just a moment, loading your account settings... </div>;
};

export default SecurityDXAuthPage;
