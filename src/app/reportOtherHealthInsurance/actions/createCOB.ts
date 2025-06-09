import { Member } from '@/models/member/api/loggedInUserInfo';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { UpdateOtherInsuranceRequest } from '../models/api/updateOtherInsuranceRequest';

export async function createCOB(
  insuranceRequest: UpdateOtherInsuranceRequest[],
  membersToProcess: Member[],
) {
  try {
    let updateCOBResponse = '';
    membersToProcess.map(async (member) => {
      updateCOBResponse = await memberService.post(
        `/api/member/v1/members/byMemberCk/${member.memberCk}/otherInsurance`,
        insuranceRequest,
      );
    });
    return updateCOBResponse;
  } catch (error) {
    logger.error('Error Response from update COB API', error);
    throw error;
  }
}
