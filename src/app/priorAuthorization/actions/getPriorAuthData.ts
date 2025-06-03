'use server';

import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { PriorAuthData } from '../models/app/priorAuthAppData';
import { invokePriorAuthDetails } from './memberPriorAuthorization';

export const getPriorAuthData = async (): Promise<
  ActionResponse<number, PriorAuthData>
> => {
  const session = await auth();
  try {
    const [phoneNumber, priorAuthDetails] = await Promise.allSettled([
      invokePhoneNumberAction(),
      invokePriorAuthDetails(),
    ]);
    return {
      status: 200,
      data: {
        priorAuthDetails:
          priorAuthDetails.status === 'fulfilled'
            ? priorAuthDetails.value
            : null,
        phoneNumber:
          phoneNumber.status === 'fulfilled' ? phoneNumber.value : '',
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    logger.error('Error in getPriorAuthData {} ', error);
    return {
      status: 400,
      data: {
        priorAuthDetails: null,
        phoneNumber: '',
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
