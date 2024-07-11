'use server';

import { auth, signIn } from '@/auth';
import { Session } from 'next-auth';

export async function dxAuth(token): Promise<Session | null> {
  const username = token; //TODO decrypt

  console.log(`Authenticating HCL Portal session: ${username}`);

  await signIn('credentials', {
    userId: username,
  });

  const dxSession = await auth();
  return dxSession;
}
