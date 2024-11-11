'use server';

import { auth, unstable_update } from '@/auth';

export async function switchUser(userId: string, planId: string) {
  const session = await auth();
  if (session) {
    await unstable_update({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      userId,
      planId,
    });
  }
}
