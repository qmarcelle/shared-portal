'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { ProcedureResponse } from '../models/procedureResponse';

export async function getProcedureCategories(): Promise<ProcedureResponse> {
  try {
    const response = await memberService.get(
      '/CostEstimatorService/ProcedureCategories/member',
    );
    logger.info('Get Procedure Categories Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Get Networks API', error);
    throw error;
  }
}
