'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { AddMemberDetails } from '@/models/add_member_details';
import { logger } from '@/utils/logger';

export async function memberData(): Promise<AddMemberDetails> {
  try {
    const memberDetails = await getMemberDetails();
    return {
      id: memberDetails.userID,
      dob: memberDetails.dateOfBirth,
    };
  } catch (error) {
    logger.error('MemberData Failure', error);
    throw error;
  }
}
