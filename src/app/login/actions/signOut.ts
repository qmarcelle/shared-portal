'use server';

import { signOut } from '@/auth';
import { clearAllExternalCookies } from '@/utils/ping_cookies';

export async function callSignOut(): Promise<void> {
  try {
    await clearAllExternalCookies();
    await signOut({
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
