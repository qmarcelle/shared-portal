import 'server-only';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { HRAInfoResponse } from '../../model/hraInfoResponse';

export async function getHRAInfo(memeCk: number): Promise<HRAInfoResponse> {
  try {
    const response = await memberService.get(
      `/api/member/v1/members/byMemberCk/${memeCk}/hraInfo`,
    );
    logger.info(
      'Spending Accounts getHRAInfo() :: ',
      JSON.stringify(response?.data),
    );
    return response?.data;
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - getHRAInfo API',
      error,
    );
    throw error;
  }
}
