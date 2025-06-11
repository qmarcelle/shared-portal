'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { PBEData } from '@/models/member/api/pbeData';
import { logger } from '@/utils/logger';
import { ALLOWED_PBE_SEARCH_PARAM } from '../../constants';
import { getAuthToken } from '../getToken';

export async function getPersonBusinessEntity(
  searchParam: ALLOWED_PBE_SEARCH_PARAM,
  searchValue: string,
  needPBE: boolean = true,
  needConsent: boolean = true,
  refresh: boolean = false, //eslint-disable-line @typescript-eslint/no-unused-vars -- Stub function
): Promise<PBEData> {
  try {
    const shouldCache = Boolean(
      searchParam && searchParam === ALLOWED_PBE_SEARCH_PARAM.UserName,
    );
    const resp = await fetch(
      `${process.env.ES_API_URL}/searchMemberLookupDetails/getPBEConsentDetails?${searchParam}=${searchValue}&isPBERequired=${needPBE}&isConsentRequired=${process.env.CONSENT_ENABLED == 'true' ? needConsent : false}`,
      {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        cache: refresh || !shouldCache ? 'no-store' : undefined,
        next: {
          revalidate: shouldCache && !refresh ? 1800 : undefined,
          tags: [searchValue],
        },
      },
    );

    const result = (await resp.json()) as ESResponse<PBEData>;

    //logger.info('PBE Data', result.data!);
    return result.data!;
  } catch (err) {
    logger.error('PBE Api Error', err);
    //TODO: Remove returning the mocked pbe Response and rethrow error
    //once we have enough test data.
    //return pbeWithMemberMultiplePRMultiplePlans.data;
    throw err;
  }
}
