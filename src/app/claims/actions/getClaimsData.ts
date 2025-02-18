import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { portalSvcsApi } from '@/utils/api/portalApi';
import {
  formatDateToIntlLocale,
  getDateTwoYearsAgoFormatted,
} from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { ClaimsResponse } from '../models/api/claimsResponse';
import { ClaimsData } from '../models/app/claimsData';

export async function getClaimsForPlans({
  memberId,
  plans,
  fromDate,
  toDate,
}: {
  memberId: string;
  plans: string;
  fromDate: string;
  toDate: string;
}) {
  try {
    const resp = await portalSvcsApi.get<ClaimsResponse>(
      `/memberservice/api/member/v1/members/byMemberCk/${memberId}/claims?from=${fromDate}&to=${toDate}&type=${plans}&includeDependents=true`,
    );
    return resp.data.claims;
  } catch (err) {
    // if (plans.includes('M')) {
    //   return claimListResponseMock.claims;
    // }
    console.error(err);
    logger.error('Claims Api Failed', err);
    throw err;
  }
}

export async function getAllClaimsData(): Promise<
  ActionResponse<number, ClaimsData>
> {
  try {
    const session = await auth();

    // Get Members
    const members = await getMemberAndDependents(
      session!.user.currUsr!.plan!.memCk,
    );

    // Get Claims for M,D,V,P
    const claims = await getClaimsForPlans({
      memberId: session!.user.currUsr!.plan!.memCk,
      fromDate: getDateTwoYearsAgoFormatted(),
      toDate: formatDateToIntlLocale(new Date()),
      plans: 'MDV',
    });

    return {
      status: 200,
      data: {
        claims: claims.map((claim) => {
          const member = members.find(
            (member) => member.memberCK == claim.memberCk,
          );
          return {
            id: claim.claimId,
            claimStatus: claim.claimStatusDescription,
            claimStatusCode: parseInt(claim.claimStatusCode.slice(-1)),
            claimType: CoverageTypes.get(claim.claimType)!,
            type: claim.claimType,
            claimTotal: null,
            issuer: claim.providerName,
            memberId: member!.id,
            memberName: member!.name,
            serviceDate: claim.claimLowServiceCalendarDate.replaceAll('-', '/'),
            claimInfo: {},
            columns: [
              {
                label: 'Total Billed',
                value: claim.claimTotalChargeAmt,
                defaultValue: '--',
                isDollar: true,
              },
              {
                label: 'Plan Paid',
                value: claim.claimPaidAmt,
                defaultValue: '--',
                isDollar: true,
              },
              {
                label: 'My Share',
                value: claim.claimPatientOweAmt,
                defaultValue: '--',
                isValueBold: true,
                isVisibleInMobile: true,
                isDollar: true,
              },
            ],
          };
        }),
        members: members.map((item) => ({
          id: item.id,
          label: item.name,
          value: item.id,
        })),
      },
    };
  } catch (err) {
    logger.error('Claims Retrieval Action Failed', err);
    return {
      status: 400,
    };
  }
}
