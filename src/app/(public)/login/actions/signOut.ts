'use server';

import { signOut } from '@/app/(system)/auth';
import { cookies } from 'next/headers';

export async function callSignOut(): Promise<void> {
  try {
    cookies().set('ST', '', {
      domain: '.bcbst.com',
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
    });
    cookies().set('ST-NO-SS', '', {
      domain: '.bcbst.com',
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
    });
    cookies().delete('interactionId');
    cookies().delete('interactionToken');
    await signOut({
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
