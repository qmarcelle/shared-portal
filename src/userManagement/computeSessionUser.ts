import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getMemberNetworkId } from '@/actions/memberNetwork';
import { revalidateUser } from '@/actions/revalidateUser';
import { PBEData } from '@/models/member/api/pbeData';
import { UserProfile } from '@/models/user_profile';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';
import { computeVisibilityRules } from '@/visibilityEngine/computeVisibilityRules';
import { SessionUser } from './models/sessionUser';

export async function computeSessionUser(
  userId: string,
  selectedUserId?: string,
  planId?: string,
): Promise<SessionUser> {
  logger.info('[computeSessionUser] ENTRY', { userId, selectedUserId, planId });
  try {
    logger.info('[computeSessionUser] Calling revalidateUser', { userId });
    revalidateUser(userId);
    logger.info('[computeSessionUser] Fetching PBE', { userId });
    const pbe = await getPersonBusinessEntity(userId, true, true, true);
    logger.info('[computeSessionUser] PBE fetched', {
      pbeSummary: pbe && pbe.getPBEDetails ? pbe.getPBEDetails.length : 'none',
    });
    logger.info('[computeSessionUser] Getting current user', {
      selectedUserId,
      planId,
    });
    const currentUser = getCurrentUser(pbe, selectedUserId, planId);
    logger.info('[computeSessionUser] Current user determined', {
      currentUser,
    });
    if (currentUser) {
      const plans = currentUser.plans;

      if (planId) {
        return computeTokenWithPlan(userId, currentUser, planId);
      } else {
        const selectedPlan = plans.length == 1 ? plans[0] : null;
        if (selectedPlan) {
          return computeTokenWithPlan(userId, currentUser, selectedPlan.memCK);
        }
        return {
          id: userId,
          currUsr: {
            fhirId: currentUser.personFhirId,
            umpi: currentUser.id,
            role: currentUser.type,
            plan: undefined,
          },
        };
      }
    } else {
      logger.error('User of given id not found');
      throw 'User Not Found';
    }
    logger.info('[computeSessionUser] EXIT success', {
      userId,
      selectedUserId,
      planId,
    });
    return {
      id: userId,
      currUsr: {
        fhirId: currentUser.personFhirId,
        umpi: currentUser.id,
        role: currentUser.type,
        plan: undefined,
      },
    };
  } catch (error) {
    logger.error('[computeSessionUser] ERROR', { error });
    throw error;
  }
}

function getCurrentUser(
  pbe: PBEData,
  selectedUserId: string | undefined,
  selectedPlanId: string | undefined,
): UserProfile {
  const userProfiles = computeUserProfilesFromPbe(
    pbe,
    selectedUserId,
    selectedPlanId,
  );
  if (selectedUserId) {
    const selectedProfile = userProfiles.find((item) => item.selected == true);
    return selectedProfile!;
  } else {
    return userProfiles[0];
  }
}

// Computes the session token with user and plan details added
async function computeTokenWithPlan(
  userId: string,
  currentUser: UserProfile,
  planId: string,
): Promise<SessionUser> {
  const loggedUserInfo = await getLoggedInUserInfo(planId, true, userId);
  const memberNetworks = await getMemberNetworkId(loggedUserInfo.networkPrefix);
  return {
    id: userId,
    currUsr: {
      fhirId: currentUser.personFhirId,
      umpi: currentUser.id,
      role: currentUser.type,
      plan: {
        fhirId: currentUser.plans.find((item) => item.memCK == planId)!
          .patientFhirId, //plan.patientFHIRID,
        grgrCk: loggedUserInfo.groupData.groupCK,
        grpId: loggedUserInfo.groupData.groupID,
        memCk: planId,
        sbsbCk: loggedUserInfo.subscriberCK,
        subId: loggedUserInfo.subscriberID,
        ntwkId: memberNetworks[0].allowable_networks.default[0].id.toString(),
      },
    },
    rules: computeVisibilityRules(loggedUserInfo),
  };
}
