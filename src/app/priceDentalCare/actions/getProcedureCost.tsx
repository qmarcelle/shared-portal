'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { ProcedureCostResponse } from '../models/procedureCostResponse';

export async function getProcedureCost(
  zipCode: string,
  procedureCode: string,
  networkCode: string,
): Promise<ProcedureCostResponse> {
  try {
    const response = await memberService.get(
      `/CostEstimatorService/CostEstimate?zipCode=${zipCode}&procedureCode=${procedureCode}&networkCode=${networkCode}&networkPrefix=DENG&consumer=member`,
    );
    logger.info('Get Procedure Cost Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Get Procedure Cost API', error);
    throw error;
  }
}
