import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { computeVisibilityRules } from '@/visibilityEngine/computeVisibilityRules';
import { SessionUser } from './models/sessionUser';

export async function computeSessionUser(
  userId: string,
  selectedUserId?: string,
  planId?: string,
): Promise<SessionUser> {
  const pbe = await getPersonBusinessEntity(userId);
  // Get the user based on the selected user(AU, PR) with umpid(maybe)
  // For now selecting the first user
  const currentUser = pbe.getPBEDetails[0];
  if (currentUser) {
    //TODO: This logic to compute memberCK has to be changed once we have more clarity on PBE Response structure
    // and we implement the user and plan switching.
    const loggedUserInfo = await getLoggedInUserInfo(
      currentUser?.relationshipInfo[0].memeCk,
    );

    // Get the plan based on the plan identifier(nativeId maybe)
    // For now selecting the first plan
    const plan = currentUser.relationshipInfo[0];
    return {
      id: userId,
      currUsr: {
        fhirId: currentUser.personFHIRID,
        umpi: currentUser.umpid,
        plan: {
          fhirId: plan.patientFHIRID,
          grgrCk: loggedUserInfo.groupData.groupCK,
          grpId: loggedUserInfo.groupData.groupID,
          memCk: plan.memeCk,
          sbsbCk: loggedUserInfo.subscriberCK,
          subId: loggedUserInfo.subscriberID,
        },
      },
      rules: await computeVisibilityRules(),
    };
  } else {
    logger.error('User of given id not found');
    throw 'User Not Found';
  }
}
