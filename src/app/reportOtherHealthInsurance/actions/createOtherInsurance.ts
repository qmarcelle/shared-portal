'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { UpdateOtherInsuranceRequest } from '../models/api/updateOtherInsuranceRequest';
import { createCOB } from './createCOB';

export async function createOtherInsurance(
  insuranceRequest: UpdateOtherInsuranceRequest,
  selectedMembers?: string[],
) {
  try {
    const session = await auth();
    const loggedInMember: LoggedInMember = await getLoggedInMember(session);
    const memberMemeck = (await loggedInMember).memeCk;

    const loggedUserInfo = await getLoggedInUserInfo(memberMemeck.toString());
    const members = loggedUserInfo.members;
    const otherHealthInsuranceRequest: UpdateOtherInsuranceRequest[] = [];

    const membersToProcess: Member[] = insuranceRequest.applyToAll
      ? members
      : members.filter((member) =>
          selectedMembers?.includes(member.firstName + ' ' + member.lastName),
        );

    // Iterate over the aggregated members list
    if (insuranceRequest.noOtherInsurance) {
      insuranceRequest.otherInsurance.forEach((insurance) => {
        if (insurance.coverageType == 'C') {
          insuranceRequest.coverageTypes.push('C');
        }
        if (insurance.coverageType == 'D') {
          insuranceRequest.coverageTypes.push('D');
        }
        if (insurance.coverageType == 'M') {
          insuranceRequest.coverageTypes.push('M');
        }
      });
    } else {
      insuranceRequest.otherInsurance.forEach((insurance) => {
        if (insurance.coverageType == 'C') {
          insuranceRequest.coverageTypes.push('C');
        }
        if (insurance.coverageType == 'D') {
          insuranceRequest.coverageTypes.push('D');
        }
        if (insurance.coverageType == 'M') {
          insuranceRequest.coverageTypes.push('M');
        }
      });
    }

    const updateCOBResponse = await createCOB(
      otherHealthInsuranceRequest,
      membersToProcess,
    );

    return updateCOBResponse;
  } catch (error) {
    logger.error('Error Response from create OtherInsurance API', error);
    throw error;
  }
}
