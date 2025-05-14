'use server';

import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { ProcedureResponse } from '../models/procedureResponse';

export async function getProcedureCategories(): Promise<ProcedureResponse[]> {
  try {
    const response = await portalSvcsApi.get(
      '/CostEstimatorService/ProcedureCategories/member',
    );
    logger.info('Get Procedure Categories Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Get Procedure Categories API', error);
    throw error;
  }
}
