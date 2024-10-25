import { pbeResponseMock } from '@/mock/pbeResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { PBEData } from '@/models/member/api/pbeData';
import { logger } from '@/utils/logger';
import { esApi } from '../esApi';

export async function getPersonBusinessEntity(
  userId: string,
  needPBE: boolean = true, //eslint-disable-line @typescript-eslint/no-unused-vars -- Stub function
): Promise<PBEData> {
  try {
    const resp = await esApi.get<ESResponse<PBEData>>(
      '/searchMemberLookupDetails/getPBEConsentDetails',
      {
        params: {
          userName: userId,
          isPBERequired: needPBE,
        },
      },
    );

    logger.info('PBE Data', resp.data.data);
    return resp.data.data!;
  } catch (err) {
    logger.error('PBE Api Error', err);
    //TODO: Remove returning the mocked pbe Response and rethrow error
    //once we have enough test data.
    return pbeResponseMock.data;
  }
}
