import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { ClaimDetailResponse } from '../models/api/claimsResponse';

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
