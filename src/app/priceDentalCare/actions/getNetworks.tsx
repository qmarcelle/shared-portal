'use server';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { Network } from '../models/network';

export async function getNetworks(): Promise<Network[]> {
  try {
    const response = await memberService.get(
      '/providers/networksByProviderType/providerType="DNTL"',
    );
    logger.info('Get Networks Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Get Networks API', error);
    throw error;
  }
}
