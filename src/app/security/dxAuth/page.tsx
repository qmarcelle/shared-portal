'use client'; //Page is client-side so it can invoke dxAuth() as a server action in order to sign in

import { useSearchParams } from 'next/navigation';
import { dxAuth } from './actions/dxAuth';

const SecurityDXAuthPage = () => {
  const dxToken = useSearchParams().get('auth');
  dxAuth(dxToken);
  return <div>Just a moment, loading your account settings...</div>;
};

export default SecurityDXAuthPage;
