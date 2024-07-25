'use server';

import { signOut } from '@/auth';

export async function callSignOut(): Promise<void> {
  try {
    await signOut({
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
