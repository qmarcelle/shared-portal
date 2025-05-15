'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { FsaAcctDetailsList } from '../model/fsaAcctDetailsResponse';

export async function getFSAAcctDetails(
  memeCk: number,
): Promise<FsaAcctDetailsList> {
  try {
    const response = await memberService.get(
      `/api/member/v1/members/byMemberCk/${memeCk}/fsaAcctDetails`,
    );
    logger.info(
      'Spending Accounts getFSAAcctDetails() :: ',
      JSON.stringify(response?.data),
    );
    return response?.data;
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - getFSAAcctDetails API',
      error,
    );
    throw error;
  }
}
