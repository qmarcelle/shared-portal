'use server';

import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { MyHealthData } from '../models/app/my_health_data';
import { getMemberWellnessRewards } from './getMemberWellnessRewards';

export const getMyHealthData = async (): Promise<
  ActionResponse<number, MyHealthData>
> => {
  const session = await auth();
  try {
    const pcpPhysician = getPCPInfo();
    const memberRewards = getMemberWellnessRewards(session);
    const [pcpPhysicianResp, memberRewardsResp] = await Promise.allSettled([
      pcpPhysician,
      memberRewards,
    ]);
    return {
      status: 200,
      data: {
        primaryCareProvider:
          pcpPhysicianResp.status == 'fulfilled'
            ? pcpPhysicianResp.value
            : null,
        memberRewards:
          memberRewardsResp.status == 'fulfilled'
            ? memberRewardsResp.value
            : null,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
        memberRewards: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
