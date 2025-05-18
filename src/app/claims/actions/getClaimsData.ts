import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PlanType } from '@/models/plan_type';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { esApi } from '@/utils/api/esApi';
import {
  formatDateToLocale,
  getDateTwoYearsAgoLocale,
} from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { HlthBenefitClaim } from '../models/api/claimsResponse';
import { ClaimsData } from '../models/app/claimsData';

export async function getClaimsForPlans({
  subscriberCk,
  memberCk,
  plans,
  fromDate,
  toDate,
}: {
  subscriberCk: string;
  memberCk: string;
  plans: string;
  fromDate: string;
  toDate: string;
}) {
  try {
    logger.info('Calling Claims API');
    const resp = await esApi.get(
      `/healthBenefitClaims?subscriberKey=${subscriberCk}&memberKey=${memberCk}&fromDate=${fromDate}&toDate=${toDate}&productTypes=${plans}`,
    );

    console.log('Raw API Response: ' + resp);

    // return healthBenefitClaimsMockResp;
    return resp?.data?.data?.HlthBenefitClaims?.HlthBenefitClaim || [];
  } catch (err) {
    console.error(err);
    logger.error('ES Claims Api Failed', err);
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
    const claimsResponse = await getClaimsForPlans({
      subscriberCk: session!.user.currUsr!.plan!.sbsbCk,
      memberCk: session!.user.currUsr!.plan!.memCk,
      fromDate: getDateTwoYearsAgoLocale(),
      toDate: formatDateToLocale(new Date()),
      plans: 'M',
    });

    let claims = claimsResponse ?? [];

    // Ensure claims is an array
    if (!Array.isArray(claims)) {
      // Extract claims array from the response
      claims = [claims];
    }

    return {
      status: 200,
      data: {
        claims: claims.map((claim: HlthBenefitClaim) => {
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
          label: item.name,
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
