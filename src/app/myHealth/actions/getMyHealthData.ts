'use server';

import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/getPCPInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { MyHealthData } from '../models/app/my_health_data';

export const getMyHealthData = async (): Promise<
  ActionResponse<number, MyHealthData>
> => {
  const session = await auth();
  try {
    const pcpPhysician = await getPCPInfo();
    return {
      status: 200,
      data: {
        primaryCareProvider: pcpPhysician,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
