'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { GetBenifitSummaryInfoResponse } from '../model/carveOutInfoResponse';

export async function getCarveOutInfo(
  memeCk: string,
  productType: string,
): Promise<GetBenifitSummaryInfoResponse> {
  try {
    const response = await memberService.get(
      `/api/member/v1/members/byMemberCk/${memeCk}/benefits/carveOutInfo/${productType}`,
    );
    return response?.data;
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - getCarveOutInfo API',
      error,
    );
    throw error;
  }
}
