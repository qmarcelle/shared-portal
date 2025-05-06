'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ProfileSettingsAppData } from '../models/app/profileSettingsAppData';
import {
  invokeEmailAction,
  invokePhoneNumberAction,
} from './profileSettingsAction';

export const getProfileSettingsData = async (): Promise<
  ActionResponse<number, ProfileSettingsAppData>
> => {
  const session = await auth();
  try {
    const memberDetails = await getLoggedInMember(session);
    const emailData = await invokeEmailAction();
    const phoneData = await invokePhoneNumberAction();
    return {
      status: 200,
      data: {
        email: emailData,
        phone: phoneData,
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
