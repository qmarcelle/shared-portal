import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { dedAndOOPBalanceMock } from '@/mock/dedAndOOPBalanceMock';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import {
  DedAndOOPBalanceResponse,
  DedAndOOPMember,
  ServiceLimitDetail,
} from '../models/api/dedAndOOPBalanceResponse';
import {
  BalanceData,
  BalancePerUser,
  ServiceLimitDetailInfo,
} from '../models/app/balancesData';

type DedAndOOPBalanceApiParams = {
  lookup?: 'bySubscriberCk' | 'byMemberCk';
  memberId: string;
  productType: string;
};

/**
 * Deductible and OutOfPocket Balance Api Call
 * @returns Deductible and OutOfPocket Balance of a member or along
 * with its dependents.
 */
export async function callGetDedAndOOPBalance({
  lookup = 'bySubscriberCk',
  memberId,
  productType = 'M',
}: DedAndOOPBalanceApiParams): Promise<DedAndOOPBalanceResponse> {
  try {
    const resp = await portalSvcsApi.get<DedAndOOPBalanceResponse>(
      `/memberlimitservice/api/member/v1/members/${lookup}/${memberId}/balances/deductibleAndOOP/${productType}`,
    );

    return resp.data;
  } catch (err) {
    logger.error('GetDedAndOOPBalance Api call failed');
    return dedAndOOPBalanceMock;
  }
}

export async function getDedAndOOPBalanceForSubscriberAndDep(
  subCk: string,
): Promise<ActionResponse<number, BalanceData>> {
  try {
    const session = await auth();
    // Get medical balance
    const respForMedical = await callGetDedAndOOPBalance({
      memberId: subCk,
      productType: 'M',
    });

    // Get dental balance
    const respForDental = await callGetDedAndOOPBalance({
      memberId: subCk,
      productType: 'D',
    });

    // Get all dependents
    const loggedInUser = getLoggedInUserInfo(session!.user.currUsr!.plan.memCk);

    const result = await Promise.allSettled([
      respForDental,
      respForMedical,
      loggedInUser,
    ]);

    if (result[2].status == 'rejected') {
      throw new Error('LoggedInUser info call Failed');
    }

    if (result[0].status == 'fulfilled' && result[1].status == 'fulfilled') {
      return {
        status: 200,
        data: {
          dental: {
            balances: mapDedAndOOPData(
              result[0].value.accumulatorsDetails[0].members,
              result[2].value,
            ),
            serviceLimitDetails: mapServiceLimitDetails(
              result[0].value.accumulatorsDetails[0].serviceLimitDetails,
            ),
          },
          medical: {
            balances: mapDedAndOOPData(
              result[1].value.accumulatorsDetails[0].members,
              result[2].value,
            ),
            serviceLimitDetails: mapServiceLimitDetails(
              result[1].value.accumulatorsDetails[0].serviceLimitDetails,
            ),
          },
        },
      };
    } else {
      return {
        status: 206,
        data: {
          dental:
            result[0].status == 'fulfilled'
              ? {
                  balances: mapDedAndOOPData(
                    result[0].value.accumulatorsDetails[0].members,
                    result[2].value,
                  ),
                  serviceLimitDetails: mapServiceLimitDetails(
                    result[0].value.accumulatorsDetails[0].serviceLimitDetails,
                  ),
                }
              : null,
          medical:
            result[1].status == 'fulfilled'
              ? {
                  balances: mapDedAndOOPData(
                    result[1].value.accumulatorsDetails[0].members,
                    result[2].value,
                  ),
                  serviceLimitDetails: mapServiceLimitDetails(
                    result[1].value.accumulatorsDetails[0].serviceLimitDetails,
                  ),
                }
              : null,
        },
      };
    }
  } catch (err) {
    logger.error('DedAndOOPBalance Retrieval failed', err);
    return {
      status: 400,
    };
  }
}

function mapDedAndOOPData(
  data: DedAndOOPMember[],
  loggedInUser: LoggedInUserInfo,
): BalancePerUser[] {
  return data.map((item) => ({
    id: item.memberCK.toString().slice(-2),
    name: loggedInUser.members.find(
      (member) => member.memberCk == item.memberCK,
    )!.firstName,
    inNetDedMax: item.inNetDedMax,
    inNetDedMet: item.inNetDedMet,
    inNetOOPMax: item.inNetOOPMax,
    inNetOOPMet: item.inNetOOPMet,
    outOfNetDedMax: item.outOfNetDedMax,
    outOfNetDedMet: item.outOfNetDedMet,
    outOfNetOOPMax: item.outOfNetOOPMax,
    outOfNetOOPMet: item.outOfNetOOPMet,
    serviceLimits: item.listofSerLimitMetDetails.map((service) => ({
      accumCode: service.accumNum,
      value: service.metAmount ?? service.usedVisits ?? 0,
    })),
  }));
}

function mapServiceLimitDetails(
  services: ServiceLimitDetail[],
): ServiceLimitDetailInfo[] {
  return services.map((item) => ({
    code: item.accumNum,
    desc: item.serviceDesc,
    isDays: item.isDays,
    isDollar: item.isDollarLimit,
    maxValue: item.maxAllowedVisits ?? item.maxAllowedAmount,
  }));
}
