'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getPriorAuthsFromES } from '@/app/priorAuthorization/actions/getPriorAuthsFromES';
import { MemberPriorAuthDetail } from '@/app/priorAuthorization/models/priorAuthData';
import { sortByDateHighToLow } from '@/app/priorAuthorization/utils/priorAuthSorts';
import { auth } from '@/auth';
import { DateFilterValues, getDateRange } from '@/utils/filterUtils';
import { logger } from '@/utils/logger';

export async function getDashboardPriorAuthData(): Promise<MemberPriorAuthDetail | null> {
  try {
    console.log('Invoked ES Call with session data');
    const session = await auth();
    const loggedInUserInfo = await getLoggedInUserInfo(
      session!.user!.currUsr!.plan!.memCk,
    );
    const sessionMembers = loggedInUserInfo.members.map((member) =>
      member.memberCk.toString(),
    );
    const dateRange = getDateRange(DateFilterValues.Last30Days);
    logger.info('Prior Auth Date Range', dateRange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const priorAuths = await getPriorAuthsFromES(
      sessionMembers,
      dateRange.fromDate,
      dateRange.toDate,
    );
    if (priorAuths.length === 0) {
      return null;
    }
    const sortedPriorAuths = priorAuths.sort(sortByDateHighToLow);
    return sortedPriorAuths[0];
  } catch (error) {
    logger.error('Error in Prior Authorization Service - Dashboard{} ', error);
    return null;
  }
}
