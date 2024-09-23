'use server';

import { getServerSideUserId } from '@/utils/server_session';

export async function getUserIdDetails(): Promise<string> {
  try {
    return await getServerSideUserId();
  } catch (error) {
    throw new Error('Invalid session');
  }
}
