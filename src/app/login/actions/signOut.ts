'use server';

import { signOut } from '@/auth';
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
    cookies().set('MPExternalSession', '', {
      domain: '.bcbst.com',
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none'
    });
    await signOut({
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
