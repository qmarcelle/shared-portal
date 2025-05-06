'use server';

import { auth } from '@/app/(system)/auth';
import { memberService } from '@/utils/api/memberService';
import {
  MEDICAL_HDHP,
  MEDICAL_HDHP_EPO,
  MEDICAL_PPO,
  MEDICAL_PPO_EPO,
  NOT_AVAILABLE,
} from '@/utils/constants';
import { logger } from '@/utils/logger';

export async function getPlanTypeData(): Promise<string | null> {
  try {
    const memberDetails = await auth();
    const response = await memberService.get(
      `/api/member/v1/members/byMemberCk/${memberDetails?.user.currUsr?.plan!.memCk}/eligibility`,
    );
    const planData = response?.data?.plans?.find(
      (plan: { planType: string; eligInd: boolean }) =>
        plan?.planType === 'M' && plan?.eligInd === true,
    );
    logger.info('Eligibility Plan Data: {}', planData);
    const planIDCharAtThree = planData?.planId?.charAt(3);
    const planIDCharAtZero = planData?.planId?.charAt(0);
    if (planData) {
      if (
        planIDCharAtThree?.toLowerCase() === 'e' ||
        planIDCharAtThree?.toLowerCase() === 'g'
      ) {
        return planIDCharAtZero?.toLowerCase() === 'g'
          ? MEDICAL_HDHP_EPO
          : MEDICAL_HDHP;
      } else {
        return planIDCharAtZero?.toLowerCase() === 'g'
          ? MEDICAL_PPO_EPO
          : MEDICAL_PPO;
      }
    }
    return NOT_AVAILABLE;
  } catch (error) {
    logger.error('Error Response from getPlanTypeData API', error);
    throw error;
  }
}
