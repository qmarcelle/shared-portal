'use server';

import { getServerSideUserId } from '@/utils/server_session';

export async function getUserIdDetails(): Promise<string> {
  return await getServerSideUserId();
}
