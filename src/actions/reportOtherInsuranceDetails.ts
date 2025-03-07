'use server';

import { AddMemberDetails } from '@/models/add_member_details';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';

export async function otherHealthInsuranceData(
  loggedUserInfo: LoggedInUserInfo,
): Promise<AddMemberDetails[]> {
  try {
    console.log('after loggedinuser', loggedUserInfo.members.length);
    const response: AddMemberDetails[] = loggedUserInfo.members
      .filter((member) => member.memRelation == 'M')
      .map((member, index) => {
        return { dob: member.birthDate, id: index };
      });
    return response;
  } catch (error) {
    logger.error('loggedInUserInfo failure', error);
    throw error;
  }
}
