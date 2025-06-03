'use server';

import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { FindCareData } from '../models/find_care_data';

export const getFindCareData = async (): Promise<
  ActionResponse<number, FindCareData>
> => {
  const session = await auth();
  try {
    const [pcpPhysicianResp] = await Promise.allSettled([getPCPInfo()]);
    return {
      status: 200,
      data: {
        primaryCareProvider:
          pcpPhysicianResp.status == 'fulfilled'
            ? pcpPhysicianResp.value
            : null,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    logger.error('Failed in getFindCareData', error);
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
