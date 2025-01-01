import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
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
    logger.error('GetDedAndOOPBalance Api call failed', err);
    throw err;
  }
}

export async function getDedAndOOPBalanceForSubscriberAndDep(): Promise<
  ActionResponse<number, BalanceData>
> {
  const session = await auth();
  try {
    // Get dental balance
    const respForDental = callGetDedAndOOPBalance({
      memberId: session!.user.currUsr!.plan.sbsbCk,
      productType: 'D',
    });

    // Get medical balance
    const respForMedical = callGetDedAndOOPBalance({
      memberId: session!.user.currUsr!.plan.sbsbCk,
      productType: 'M',
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
              result[0].value.accumulatorsDetails[0]?.members,
              result[2].value,
            ),
            serviceLimitDetails: mapServiceLimitDetails(
              result[0].value.accumulatorsDetails[0]?.serviceLimitDetails,
            ),
          },
          medical: {
            balances: mapDedAndOOPData(
              result[1].value.accumulatorsDetails[0]?.members,
              result[2].value,
            ),
            serviceLimitDetails: mapServiceLimitDetails(
              result[1].value.accumulatorsDetails[0]?.serviceLimitDetails,
            ),
          },
          visibilityRules: session?.user.vRules,
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
                    result[0].value.accumulatorsDetails[0]?.members,
                    result[2].value,
                  ),
                  serviceLimitDetails: mapServiceLimitDetails(
                    result[0].value.accumulatorsDetails[0]?.serviceLimitDetails,
                  ),
                }
              : undefined,
          medical:
            result[1].status == 'fulfilled'
              ? {
                  balances: mapDedAndOOPData(
                    result[1].value.accumulatorsDetails[0]?.members,
                    result[2].value,
                  ),
                  serviceLimitDetails: mapServiceLimitDetails(
                    result[1].value.accumulatorsDetails[0]?.serviceLimitDetails,
                  ),
                }
              : undefined,
          visibilityRules: session?.user.vRules,
        },
      };
    }
  } catch (err) {
    console.error(err);
    logger.error('DedAndOOPBalance Retrieval failed', err);
    return {
      status: 400,
      data: {
        visibilityRules: session?.user.vRules,
      },
    };
  }
}

function mapDedAndOOPData(
  data: DedAndOOPMember[] | undefined,
  loggedInUser: LoggedInUserInfo,
): BalancePerUser[] {
  if (!data) {
    return [];
  }
  return data.map((item) => {
    const member = loggedInUser.members.find(
      (member) => member.memberCk == item.memberCK,
    );
    return {
      id: member!.firstName + item.memberCK.toString().slice(-2), // This is done to prevent memberCK exposure
      name: member!.firstName + ' ' + member!.lastName,
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
    };
  });
}

function mapServiceLimitDetails(
  services: ServiceLimitDetail[] | undefined,
): ServiceLimitDetailInfo[] {
  if (!services) {
    return [];
  }
  return services.map((item) => ({
    code: item.accumNum,
    desc: item.serviceDesc,
    isDays: item.isDays,
    isDollar: item.isDollarLimit,
    maxValue: item.maxAllowedVisits ?? item.maxAllowedAmount,
  }));
}
