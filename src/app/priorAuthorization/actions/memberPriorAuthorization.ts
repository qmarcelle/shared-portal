'use server';
import { auth } from '@/auth';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { esApi } from '@/utils/api/esApi';
import { formatDateToShortYear } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { format, startOfYear, subDays, subYears } from 'date-fns';
import { MemberPriorAuthDetail } from '../models/priorAuthData';
import { PriorAuthDetails } from '../models/priorAuthDetails';

export async function invokePriorAuthDetails(): Promise<PriorAuthDetails[]> {
  try {
    const session = await auth();
    const memberList: string[] = [];
    const pbeResponse = await getPersonBusinessEntity(session!.user!.id);
    const selectedPlan = pbeResponse.getPBEDetails[0].relationshipInfo.find(
      (item) => item?.memeCk === session?.user.currUsr?.plan?.memCk,
    );
    memberList.push(session?.user.currUsr?.plan?.memCk ?? '');
    selectedPlan?.relatedPersons.forEach((item) => {
      memberList.push(item.relatedPersonMemeCk.toString());
    });
    const dateRange = await getDateRange(
      process.env.DEFAULT_PRIOR_AUTH_SEARCH_RANGE ?? 'A',
    );
    logger.info('Prior Auth Date Range', dateRange);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const priorAuthresponseList: any[] = [];
    for (const memberData of memberList) {
      const apiResponse = await esApi.get(
        `/memberPriorAuthDetails?memberKey=${memberData}&fromDate=${dateRange.fromDate}&toDate=${dateRange.toDate}`, // froDate and toDate is dependant on filter integration
      );
      if (
        apiResponse?.data?.data?.memberPriorAuthDetails
          ?.memberPriorAuthDetail != null
      ) {
        const priorAuthresponse =
          apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail.map(
            (item: MemberPriorAuthDetail) => ({
              issuer: item['serviceGroupDescription'],
              priorAuthStatus: item['statusDescription'],
              serviceDate: formatDateToShortYear(item['fromDate']),
              memberName: item['firstName'] + ' ' + item['lastName'],
              referenceId: item['referenceId'],
              columns: [
                {
                  label: 'Referred by',
                  value: item.getProviderReferredBy.name,
                  defaultValue: 'N/A',
                },
                {
                  label: 'Referred to',
                  value: item.getProviderReferredTo.name,
                  defaultValue: 'N/A',
                },
              ],
            }),
          );

        priorAuthresponseList.push(...priorAuthresponse);
      }
    }
    return priorAuthresponseList;
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    throw error;
  }
}

export const getDateRange = (category: string) => {
  /**Determine the Date Rage for Prior Auth 
  [ A - 30 days, B - Last 90 Days, C - Current Calendar, D - Last 2 Years]*/
  const today = new Date();
  let fromDate, toDate;
  switch (category) {
    case 'A':
      fromDate = subDays(today, 30);
      toDate = today;
      break;
    case 'B':
      fromDate = subDays(today, 90);
      toDate = today;
      break;
    case 'C':
      fromDate = startOfYear(today);
      toDate = today;
      break;
    case 'D':
      fromDate = subYears(today, 2);
      toDate = today;
      break;
    default:
      throw Error('Invalid date range');
  }
  return {
    fromDate: format(fromDate, 'MM/dd/yyyy'),
    toDate: format(toDate, 'MM/dd/yyyy'),
  };
};
