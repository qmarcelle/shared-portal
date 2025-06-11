'use server';
import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { DateFilterValues, getDateRange } from '@/utils/filterUtils';
import { logger } from '@/utils/logger';
import { MemberPriorAuthDetail } from '../models/priorAuthData';
import { getPriorAuthsFromES } from './getPriorAuthsFromES';

export async function invokePriorAuthDetails(
  selectDateRange: DateFilterValues = DateFilterValues.Last120Days,
): Promise<MemberPriorAuthDetail[]> {
  try {
    console.log('Invoked ES Call with session data');
    const session = await auth();
    const loggedInUserInfo = await getLoggedInUserInfo(
      session!.user!.currUsr!.plan!.memCk,
    );
    const sessionMembers = loggedInUserInfo.members.map((member) =>
      member.memberCk.toString(),
    );
    const dateRange = getDateRange(selectDateRange);
    logger.info('Prior Auth Date Range', dateRange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    return await getPriorAuthsFromES(
      sessionMembers,
      dateRange.fromDate,
      dateRange.toDate,
    );
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    throw error;
  }
}

export async function invokePriorAuthsForMember(
  memberCk: string,
  selectDateRange: DateFilterValues,
): Promise<MemberPriorAuthDetail[]> {
  try {
    console.log('Invoked ES Call with provided MemberCk list');
    const dateRange = getDateRange(selectDateRange);
    logger.info('Prior Auth Date Range', dateRange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await getPriorAuthsFromES(
      [memberCk],
      dateRange.fromDate,
      dateRange.toDate,
    );
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    throw error;
  }
}
