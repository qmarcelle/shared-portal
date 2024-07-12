'use server';

import { signIn } from '@/auth';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export const dxAuth = async (token): Promise<Session | null> => {
  if (!token) {
    console.log(`No token!`);
    redirect('/login');
  }
  const username = token; //TODO decrypt

  console.log(`Authenticating HCL Portal session: ${username}`);

  await signIn('credentials', {
    userId: username,
  });

  redirect(`/security`);
};
