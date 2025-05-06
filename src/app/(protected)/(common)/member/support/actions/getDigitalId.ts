'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { DigitalIdResponse } from '../model/api/digital_id';

export async function getDigitalId(
  groupId: string,
  memberCk: string,
): Promise<ESResponse<DigitalIdResponse>> {
  try {
    const response = await esApi.get(
      `/memberDetails/hashKey?memberKey=${memberCk}&groupId=${groupId}`,
    );

    return response.data;
  } catch (error) {
    logger.error('Get Digital Id API Failure', error);
    throw error;
  }
}
