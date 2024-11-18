'use server';

import { auth } from '@/auth';
import { AddMemberDetails } from '@/models/add_member_details';
import { logger } from '@/utils/logger';
import { getLoggedInUserInfo } from './loggedUserInfo';

export async function otherHealthInsuranceData(): Promise<AddMemberDetails[]> {
  try {
    const memberDetails = await auth();
    const result = await getLoggedInUserInfo(
      `${memberDetails?.user.currUsr?.plan.memCk}`,
    );
    const response: AddMemberDetails[] = result.members
      .filter((member) => member.memRelation === 'M')
      .map((member, index) => ({
        dob: member.birthDate,
        id: index,
      }));
    return response;
  } catch (error) {
    logger.error('loggedInUserInfo failure', error);
    throw error;
  }
}
