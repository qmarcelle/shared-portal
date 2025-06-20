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
  impersonator?: string,
): Promise<SessionUser> {
  try {
    logger.info('Calling computeSessionUser');
    revalidateUser(userId);
    // Get the PBE of the loggedIn user
    // The loggedIn user here is the user who has logged in
    // and not the user role to which user has switched to.
    const pbe = await getPersonBusinessEntity(userId, true, true, true);

    // Get the current user to which user has either switched to or
    // their actual role with the selected plan.
    // if user has only one plan, it is default selected.
    // if multiple plans with no selected planId, no plan is selected.
    const currentUser = getCurrentUser(pbe, selectedUserId, planId);
    if (currentUser) {
      const plans = currentUser.plans;

      if (planId) {
        return computeTokenWithPlan(userId, currentUser, planId, impersonator);
      } else {
        // If no planId is provided, default to the first plan if available (even if multiple exist)
        // This ensures currUsr.plan is populated during initial login.
        logger.info(
          '[computeSessionUser] No planId provided. currentUser.plans content:',
          currentUser.plans, // Log the entire plans array
        );
        const selectedPlan = plans.length >= 1 ? plans[0] : null;
        if (selectedPlan) {
          return computeTokenWithPlan(
            userId,
            currentUser,
            selectedPlan.memCK, // Use memCK of the selected default plan
            impersonator,
          );
        }
        // This block will now only be reached if currentUser has NO plans at all.
        // This might indicate an issue with the user's data or PBE processing.
        logger.warn(
          '[computeSessionUser] Current user has no plans. currUsr.plan will be undefined.',
          { userId, selectedUserId, pbeCurrentUserId: currentUser.id },
        );
        return {
          id: userId,
          currUsr: {
            fhirId: currentUser.personFhirId,
            umpi: currentUser.id,
            role: currentUser.type,
            plan: undefined,
          },
          impersonated: !!impersonator,
          impersonator,
        };
      }
    } else {
      logger.error('User of given id not found');
      throw 'User Not Found';
    }
  } catch (err) {
    logger.error('Compute Session Error occurred', err);
    throw err;
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
  impersonator?: string,
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
        ntwkId:
          memberNetworks[0].allowable_networks.default[0]?.id.toString() ?? '',
      },
    },
    rules: computeVisibilityRules(loggedUserInfo),
    impersonated: !!impersonator,
    impersonator: impersonator,
  };
}
