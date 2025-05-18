'use server';

import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PriorAuthData } from '../models/app/priorAuthAppData';
import { invokePriorAuthDetails } from './memberPriorAuthorization';

export const getPriorAuthData = async (): Promise<
  ActionResponse<number, PriorAuthData>
> => {
  const session = await auth();
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const priorAuthDetails = await invokePriorAuthDetails();
    return {
      status: 200,
      data: {
        priorAuthDetails: priorAuthDetails,
        phoneNumber: phoneNumber,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        priorAuthDetails: null,
        phoneNumber: phoneNumber,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
