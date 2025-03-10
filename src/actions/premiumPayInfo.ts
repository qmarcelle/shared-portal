'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';

export interface PremiumPayResponse {
  paymentDue: string;
  currentBalance: string;
  currentStmtBalance: string;
}

export async function getPremiumPayInfo(
  memberCk: string,
): Promise<PremiumPayResponse> {
  try {
    const resp = await memberService.get<PremiumPayResponse>(
      `/api/member/v1/members/byMemberCk/${memberCk}/premiumPayInfo`,
    );

    return resp.data;
  } catch (error) {
    logger.error('PremiumPayInfo API Failed', error);
    throw error;
  }
}
