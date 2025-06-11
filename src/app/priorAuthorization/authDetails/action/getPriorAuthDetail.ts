'use server';
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { esApi } from '@/utils/api/esApi';
import { DateFilterValues, getDateRange } from '@/utils/filterUtils';
import { logger } from '@/utils/logger';
import { MemberPriorAuthDetail } from '../../models/priorAuthData';

export async function populatePriorAuthDetails(
  referenceId: string,
): Promise<MemberPriorAuthDetail | null> {
  try {
    const session = await auth();
    const loggedInUserInfo = await getLoggedInUserInfo(
      session!.user!.currUsr!.plan!.memCk,
    );
    const sessionMembers = loggedInUserInfo.members.map((member) =>
      member.memberCk.toString(),
    );
    const dateRange = await getDateRange(DateFilterValues.LastTwoYears);
    let priorAuthDetail;
    for (const memberData of sessionMembers) {
      try {
        const apiResponse = await esApi.get(
          `/memberPriorAuthDetails?memberKey=${memberData}&fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`, // froDate and toDate is dependant on filter integration
        );
        if (
          apiResponse?.data?.data?.memberPriorAuthDetails
            ?.memberPriorAuthDetail != null
        ) {
          priorAuthDetail =
            apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail.find(
              (item: { referenceId: string }) =>
                item.referenceId === referenceId,
            );
          if (priorAuthDetail != null) {
            return priorAuthDetail;
          }
        }
      } catch (error) {
        logger.error(
          `Error fetching prior auth details for member ${memberData}`,
          error,
        );
        continue; // Skip to the next member if an error occurs
      }
    }
    return priorAuthDetail ?? null;
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    return null;
  }
}
