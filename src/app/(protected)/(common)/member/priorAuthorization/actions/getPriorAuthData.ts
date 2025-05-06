'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { PriorAuthData } from '../models/app/priorAuthAppData';
import { invokeSortData } from './memberPriorAuthorization';

export const getPriorAuthData = async (): Promise<
  ActionResponse<number, PriorAuthData>
> => {
  try {
    const priorAuthData = await invokeSortData();
    return { status: 200, data: { claimDetails: priorAuthData } };
  } catch (error) {
    return { status: 400, data: { claimDetails: null } };
  }
};
