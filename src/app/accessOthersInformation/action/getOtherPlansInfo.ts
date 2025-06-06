import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { transformPolicyToPlans } from '@/utils/policy_computer';
import {
  OtherPlanDetails,
  OtherPlansData,
} from '../models/OtherPlanInfoDetails';

export const OtherPlanInformationData = async (): Promise<
  ActionResponse<number, OtherPlansData>
> => {
  try {
    const session = await auth();
    const pbeResponse = await getPersonBusinessEntity(session!.user!.id);

    logger.info('Success Response from PBE API', pbeResponse);

    const selectedAU = pbeResponse.getPBEDetails[0].relationshipInfo.filter(
      (item) => item.personRoleType === 'AU',
    );

    const relatedPersonDetails = selectedAU
      .flatMap((item) => item.relatedPersons || [])
      .filter(
        (item) =>
          item.relatedPersonRoleType !== 'AU' &&
          item.relatedPersonRoleType !== 'PR',
      );

    const memberData: OtherPlanDetails[] = relatedPersonDetails.map((item) => ({
      memberName: `${item.relatedPersonFirstName} ${item.relatedPersonLastName}`,
      DOB: item.relatedPersonDob,
      memberCk: String(item.relatedPersonMemeCk), // Ensure string type
      roleType: item.relatedPersonRoleType,
    }));
    const plans = await getPolicyInfo(memberData.map((item) => item.memberCk));
    logger.info('Filtered Member Data', memberData);
    logger.info('planInfo', transformPolicyToPlans(plans));
    return {
      status: 200,
      data: {
        memberDetails: {
          memberData: memberData,
          plans: transformPolicyToPlans(plans),
        },
      },
    };
  } catch (error) {
    logger.error('Error in OtherPlanInformationData {}', error);
    return {
      status: 400,
      data: {
        memberDetails: null,
      },
    };
  }
};
