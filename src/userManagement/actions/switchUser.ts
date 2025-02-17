'use server';

import { auth, unstable_update } from '@/auth';

export async function switchUser(userId?: string, planId?: string) {
  const session = await auth();
  if (session) {
    await unstable_update({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      userId: userId ? userId : session.user.currUsr?.umpi,
      // We will pass planId only when userId is null ie. no user switch
      // only plan switch
      planId: userId == null ? planId : null,
    });
  }
}
