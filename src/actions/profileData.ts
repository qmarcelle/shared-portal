'use server';

import { auth } from '@/auth';
import { UserProfile } from '@/models/user_profile';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';

export async function getUserProfiles(): Promise<UserProfile[]> {
  logger.info('[getUserProfiles] ENTRY');
  try {
    const session = await auth();
    logger.info('[getUserProfiles] Session fetched', {
      userId: session?.user.id,
    });
    const selectedUserId = session?.user.currUsr?.umpi;
    const selectedPlanId = session?.user.currUsr.plan?.memCk;
    logger.info('[getUserProfiles] Calling getPersonBusinessEntity', {
      userId: session?.user.id,
    });
    const pbe = await getPersonBusinessEntity(session!.user.id);
    logger.info('[getUserProfiles] PBE fetched', {
      pbeSummary: pbe && pbe.getPBEDetails ? pbe.getPBEDetails.length : 'none',
    });
    const profiles = computeUserProfilesFromPbe(
      pbe,
      selectedUserId,
      selectedPlanId,
    );
    logger.info('[getUserProfiles] Profiles computed', {
      count: profiles.length,
    });
    logger.info('[getUserProfiles] EXIT success');
    return profiles;
  } catch (error) {
    logger.error('[getUserProfiles] ERROR', { error });
    throw error;
  }
}
