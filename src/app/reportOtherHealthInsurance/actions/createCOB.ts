import { LoggedInMember } from '@/models/app/loggedin_member';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';

export async function createCOB(
  insuranceRequest: OtherHealthInsuranceDetails[],
  loggedInMember: LoggedInMember,
  userId: string,
) {
  try {
    const request = {
      insuranceRequest,
      userId,
    };
    const updateCOBResponse = await memberService.post<
      OtherHealthInsuranceDetails[]
    >(
      `/api/member/v1/members/byMemberCk/${loggedInMember.memeCk}/otherInsurance`,
      request,
    );

    return updateCOBResponse.data;
  } catch (error) {
    logger.error('Error Response from upadate COB API', error);
    throw error;
  }
}
