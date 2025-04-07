'use server';

import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { ActionResponse } from '@/models/app/actionResponse';
import { PriorAuthData } from '../models/app/priorAuthAppData';
import { invokeSortData } from './memberPriorAuthorization';

export const getPriorAuthData = async (): Promise<
  ActionResponse<number, PriorAuthData>
> => {
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const priorAuthData = await invokeSortData();
    return {
      status: 200,
      data: { claimDetails: priorAuthData, phoneNumber: phoneNumber },
    };
  } catch (error) {
    return {
      status: 400,
      data: { claimDetails: null, phoneNumber: phoneNumber },
    };
  }
};
