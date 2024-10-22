'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { ActionResponse } from '@/models/app/actionResponse';
import { ProfileSettingsAppData } from '../models/app/profileSettingsAppData';
import {
  invokeEmailAction,
  invokePhoneNumberAction,
} from './profileSettingsAction';

export const getProfileSettingsData = async (): Promise<
  ActionResponse<number, ProfileSettingsAppData>
> => {
  try {
    const memberDetails = await getMemberDetails();
    const emailData = await invokeEmailAction();
    const phoneData = await invokePhoneNumberAction();
    return {
      status: 200,
      data: {
        email: emailData,
        phone: phoneData,
        memberDetails: {
          fullName: memberDetails.first_name + ' ' + memberDetails.last_name, // Replace fullName with first_name+last_name of member object
          dob: memberDetails.dateOfBirth, // Replace dob with dateOfBirth of member object  const getData = useProfileSettingsStore();
        },
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: { email: '', phone: '', memberDetails: { fullName: '', dob: '' } },
    };
  }
};
