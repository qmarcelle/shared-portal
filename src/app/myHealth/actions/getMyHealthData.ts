'use server';

import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/getPCPInfo';
import { ActionResponse } from '@/models/app/actionResponse';
import { MyHealthData } from '../models/app/my_health_data';

export const getMyHealthData = async (): Promise<
  ActionResponse<number, MyHealthData>
> => {
  try {
    const pcpPhysician = await getPCPInfo();
    return {
      status: 200,
      data: {
        primaryCareProvider: pcpPhysician,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
      },
    };
  }
};
