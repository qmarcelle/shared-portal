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
    if (memberCk) {
      const resp = await memberService.get<PremiumPayResponse>(
        `/api/member/v1/members/byMemberCk/${memberCk}/premiumPayInfo`,
      );
      logger.info('payPremiumApiResponse', resp);
      return resp.data;
    } else {
      logger.info('PremiumPayInfo API - Memeck Not available');
      return {
        paymentDue: '',
        currentBalance: '',
        currentStmtBalance: '',
      };
    }
  } catch (error) {
    logger.error('PremiumPayInfo API Failed', error);
    return {
      paymentDue: '',
      currentBalance: '',
      currentStmtBalance: '',
    };
  }
}
