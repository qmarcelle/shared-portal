'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { UserProfile } from '@/models/user_profile';
import { logger } from '@/utils/logger';

export async function profileData(): Promise<UserProfile> {
  try {
    const memberDetails = await getMemberDetails();
    return {
      id: memberDetails.userID,
      name: memberDetails.first_name + ' ' + memberDetails.last_name, // Replace fullName with first_name+last_name of member object
      dob: memberDetails.dateOfBirth,
    };
  } catch (error) {
    logger.error('profileData failure', error);
    throw error;
  }
}
