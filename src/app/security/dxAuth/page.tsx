'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { dxAuth } from './actions/dxAuth';

async function initializeDXPortalAuth() {
  const dxToken = useSearchParams().get('u'); //eslint-disable-line react-hooks/rules-of-hooks
  await dxAuth(dxToken);
}

const SecurityDXAuthPage = () => {
  useEffect(() => {
    initializeDXPortalAuth();
  });

  return <div>Just a moment, loading your account settings... </div>;
};

export default SecurityDXAuthPage;
