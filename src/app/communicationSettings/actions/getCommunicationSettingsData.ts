'use server';

import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { CommunicationSettingsAppData } from '../models/app/communicationSettingsAppData';
import { getCommunicationSettingsAppData } from './communicationSettingsAction';

export const getCommunicationSettingsData = async (): Promise<
  ActionResponse<number, CommunicationSettingsAppData>
> => {
  const session = await auth();
  try {
    const response = await getCommunicationSettingsAppData();
    const tierOneDescriptions = response.tierOne
      ? response.tierOne.map((item) => {
          const hTexts = item.description
            .filter((desc) => desc.type === 'h')
            .map((desc) => desc.texts)
            .flat();
          const pTexts = item.description
            .filter((desc) => desc.type === 'p')
            .map((desc) => desc.texts)
            .flat();
          return { hTexts, pTexts };
        })
      : [];

    const phoneNumber = await invokePhoneNumberAction();

    return {
      status: 200,
      data: {
        emailAddress: response.emailAddress,
        mobileNumber: response.mobileNumber,
        dutyToWarn: response.dutyToWarn,
        visibilityRules: session?.user.vRules,
        tierOneDescriptions,
        tierOne: response.tierOne,
        phoneNumber: phoneNumber,
      },
    };
  } catch (error) {
    logger.error('getCommunicationSettingsData failed', error);
    return {
      status: 400,
    };
  }
};
