'use server';

import { auth } from '@/auth';
import { VisibilityRules } from '@/visibilityEngine/rules';

export async function getVisibilityRules(): Promise<
  VisibilityRules | undefined
> {
  const session = await auth();
  return session?.user.vRules;
}
