'use server';
import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getDateRange } from '../../actions/memberPriorAuthorization';
import { MemberPriorAuthDetail } from '../../models/priorAuthData';

export async function populatePriorAuthDetails(
  referenceId: string,
): Promise<MemberPriorAuthDetail> {
  try {
    const session = await auth();
    const memberList = await getMemberAndDependents(
      session?.user.currUsr.plan?.memCk ?? '',
    );
    const dateRange = getDateRange(
      process.env.PRIOR_AUTH_FILTER_DATE_RANGE ?? 'A',
    );
    let priorAuthDetail;
    for (const memberData of memberList) {
      const apiResponse = await esApi.get(
        `/memberPriorAuthDetails?memberKey=${memberData.memberCK}&fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`, // froDate and toDate is dependant on filter integration
      );
      if (
        apiResponse?.data?.data?.memberPriorAuthDetails
          ?.memberPriorAuthDetail != null
      ) {
        priorAuthDetail =
          apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail.find(
            (item: { referenceId: string }) => item.referenceId === referenceId,
          );
        if (priorAuthDetail != null) return priorAuthDetail;
      }
    }
    return priorAuthDetail;
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    throw error;
  }
}
