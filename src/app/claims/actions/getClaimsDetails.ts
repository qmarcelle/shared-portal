import { getMemberAndDependents } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CoverageTypes } from '@/userManagement/models/coverageType';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { ClaimDetailResponse } from '../models/api/claimsResponse';
import { ClaimDetailsData } from '../models/app/claimDetailsData';

export async function getClaimDetails(
  subscriberCk: string,
  claimId: string,
  claimType: string,
) {
  try {
    subscriberCk = '91722400';
    claimId = 'EXT820200100';
    claimType = 'M';
    const resp = await portalSvcsApi.get<ClaimDetailResponse>(
      `/memberservice/api/v1/claims/${subscriberCk}/${claimId}/${claimType}`,
    );
    return resp.data.claim;
  } catch (err) {
    console.error(err);
    logger.error('Claim Details Api Failed', err);
    throw err;
  }
}

export async function getClaimDetailsData(
  claimId: string,
  claimType: string,
): Promise<ActionResponse<number, ClaimDetailsData>> {
  try {
    const session = await auth();
    // Get Members
    const members = await getMemberAndDependents(
      session!.user.currUsr!.plan!.memCk,
    );
    const claim = await getClaimDetails(
      session?.user.currUsr.plan?.sbsbCk ?? '',
      claimId,
      claimType,
    );
    const member = members.find((member) => member.memberCK == claim.memberCk);
    return {
      status: 200,
      data: {
        claim,
        claimInfo: {
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
        },
      },
    };
  } catch (error) {
    logger.error('Claim Details Retrieval Action Failed', error);
    return {
      status: 400,
    };
  }
}
