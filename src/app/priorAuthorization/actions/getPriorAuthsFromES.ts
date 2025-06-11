'use server';
import { filterToSessionMembers } from '@/actions/filterToSessionMembers';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { MemberPriorAuthDetail } from '../models/priorAuthData';

export const getPriorAuthsFromES = async (
  memberList: string[],
  fromDate: string,
  toDate: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let priorAuthResponseList: MemberPriorAuthDetail[] = [];
  const sessionMembers = await filterToSessionMembers(memberList);
  if (sessionMembers.length === 0) {
    logger.warn('No session members found for the provided member list.');
    return priorAuthResponseList;
  }

  const priorAuthResponsePromises = sessionMembers.map(async (memberCk) => {
    const apiResponse = await esApi.get(
      `/memberPriorAuthDetails?memberKey=${memberCk}&fromDate=${fromDate}&toDate=${toDate}`,
    );
    logger.info(`API response for memberKey ${memberCk}:`, apiResponse?.data);
    return (
      apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail ??
      []
    );
  });

  priorAuthResponseList = (
    await Promise.allSettled(priorAuthResponsePromises)
  ).flatMap((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error('Error in promise:', result.reason);
      return [];
    }
  });
  return priorAuthResponseList;
};
