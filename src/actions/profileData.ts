'use server';

import { auth } from '@/auth';
import { UserProfile } from '@/models/user_profile';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { ALLOWED_PBE_SEARCH_PARAM } from '@/utils/constants';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';

export async function getUserProfiles(): Promise<UserProfile[]> {
  const session = await auth();
  const selectedUserId = session?.user.currUsr?.umpi;
  const selectedPlanId = session?.user.currUsr.plan?.memCk;
  const pbe = await getPersonBusinessEntity(
    ALLOWED_PBE_SEARCH_PARAM.UserName,
    session!.user.id,
  );
  return computeUserProfilesFromPbe(pbe, selectedUserId, selectedPlanId);
}
