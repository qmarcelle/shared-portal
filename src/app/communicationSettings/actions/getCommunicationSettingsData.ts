'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
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

    return {
      status: 200,
      data: {
        emailAddress: response.emailAddress,
        mobileNumber: response.mobileNumber,
        dutyToWarn: response.dutyToWarn,
        visibilityRules: session?.user.vRules,
        tierOneDescriptions,
      },
    };
  } catch (error) {
    return {
      status: 400,
    };
  }
};
