import 'server-only';
import { ClaimsResponse } from '@/app/claims/models/api/claimsResponse';
import { auth } from '@/auth';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';

export const getInternalFSATransactionDetails = async (
  fromDate: string,
  toDate: string,
): Promise<ClaimsResponse> => {
  const session = await auth();
  try {
    const response = await memberService.get(
      `/api/v1/fsaClaims?subscriberCk=${session!.user.currUsr!.plan!.sbsbCk}&memberCk=${session!.user.currUsr!.plan!.memCk}&fromDate=${fromDate}&toDate=${toDate}`,
    );
    logger.info(
      'Spending Accounts getFSATransactions () :: ',
      JSON.stringify(response?.data),
    );
    return response?.data as ClaimsResponse;
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - getFSATransactions API',
      error,
    );
    throw error;
  }
};
