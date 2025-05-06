'use server';

import { auth } from '@/app/(system)/auth';
import { UserProfile } from '@/models/user_profile';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';

export async function getUserProfiles(): Promise<UserProfile[]> {
  const session = await auth();
  const selectedUserId = session?.user.currUsr?.umpi;
  const selectedPlanId = session?.user.currUsr.plan?.memCk;
  const pbe = await getPersonBusinessEntity(session!.user.id);
  return computeUserProfilesFromPbe(pbe, selectedUserId, selectedPlanId);
}
