'use server';

import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';

interface MedicareInfo {
  medicareId: string;
}

export async function getMedicareId(memberCk: string): Promise<string> {
  let medicareId = '';
  try {
    const resp = await portalSvcsApi.get<MedicareInfo>(
      `/memberservice/api/v1/medicareInfo?memberCk=${memberCk}`,
    );

    medicareId = resp.data.medicareId;
    logger.info('Success Response from Medicare Id API', resp);
  } catch (error) {
    logger.error('Error Response from Medicare Id API', error);
  }
  return medicareId;
}
