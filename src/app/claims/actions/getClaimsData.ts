import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PlanType } from '@/models/plan_type';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { memberService } from '@/utils/api/memberService';
import {
  formatDateToIntlLocale,
  getDateTwoYearsAgoFormatted,
} from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { Claim, ClaimsResponse } from '../models/api/claimsResponse';
import { ClaimsData } from '../models/app/claimsData';

export async function getClaimsForPlans({
  memberCk,
  plans,
  fromDate,
  toDate,
}: {
  memberCk: string;
  plans: string;
  fromDate: string;
  toDate: string;
}) {
  try {
    logger.info('Calling Claims API');

    // const resp = await esApi.get(
    //   `/healthBenefitClaims?subscriberKey=${subscriberCk}&memberKey=${memberCk}&fromDate=${fromDate}&toDate=${toDate}&productTypes=${plans}`,
    // );

    const resp = await memberService.get<ClaimsResponse>(
      `/api/member/v1/members/byMemberCk/${memberCk}/claims?from=${fromDate}&to=${toDate}&type=${plans}&includeDependents=true`,
    );

    console.log('Raw API Response: ' + resp);

    // return healthBenefitClaimsMockResp;
    return resp?.data?.claims || [];
  } catch (err) {
    console.error(err);
    logger.error('ES Claims Api Failed', err);
    throw err;
  }
}

export async function getAllClaimsData(
  planType: string = 'MDV', // Default to "M" if planType is not provided
): Promise<ActionResponse<number, ClaimsData>> {
  try {
    const session = await auth();

    // Get Members
    const members = await getMemberAndDependents(
      session!.user.currUsr!.plan!.memCk,
    );

    const claimsResponse = await getClaimsForPlans({
      memberCk: session!.user.currUsr!.plan!.memCk,
      fromDate: getDateTwoYearsAgoFormatted(),
      toDate: formatDateToIntlLocale(new Date()),
      plans: planType,
    });

    // Map and process claims
    return {
      status: 200,
      data: {
        claims: claimsResponse.map((claim: Claim) => {
          const member = members.find(
            (member) => member.memberCK === Number(claim.memberCk),
          );
          return {
            id: claim.claimId,
            encryptedClaimId: encrypt(claim.claimId),
            claimStatus: claim.claimStatusDescription,
            claimStatusCode: parseInt(claim.claimStatusCode.slice(-1)),
            claimType:
              (CoverageTypes.get(claim.claimType) as PlanType) || 'Unknown',
            type: claim.claimType,
            claimTotal: null,
            issuer: claim.providerName,
            memberId: member?.id || 'Unknown',
            memberName: member?.name || 'Unknown',
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
          label: toPascalCase(item.name),
          value: item.id,
        })),
      },
    };
  } catch (err) {
    console.error(err);
    logger.error('Claims Retrieval Action Failed', err);
    return {
      status: 400,
    };
  }
}
