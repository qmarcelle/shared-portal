'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { getContactInfo } from '@/app/myPlan/actions/getAllPlansData';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { ProfileSettingsAppData } from '../models/app/profileSettingsAppData';

export const getProfileSettingsData = async (): Promise<
  ActionResponse<number, ProfileSettingsAppData>
> => {
  const session = await auth();
  try {
    const memberDetails = await getLoggedInMember(session);
    const contactInfo = await getContactInfo(session?.user.currUsr?.umpi ?? '');
    logger.info(
      'Profile Settings email: ' +
        contactInfo.email +
        ' phone: ' +
        contactInfo.phone,
    );
    return {
      status: 200,
      data: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        memberDetails: {
          fullName: memberDetails.firstName + ' ' + memberDetails.lastName, // Replace fullName with first_name+last_name of member object
          dob: memberDetails.dateOfBirth, // Replace dob with dateOfBirth of member object  const getData = useProfileSettingsStore();
        },
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        email: '',
        phone: '',
        memberDetails: { fullName: '', dob: '' },
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
