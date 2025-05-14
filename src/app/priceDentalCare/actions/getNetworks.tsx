'use server';

import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { Network } from '../models/network';

export async function getNetworks(): Promise<Network[]> {
  try {
    const response = await portalSvcsApi.get(
      '/CostEstimatorService/providers/networksByProviderType?providerType=DNTL',
    );
    logger.info('Get Networks Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Get Networks API', error);
    throw error;
  }
}
