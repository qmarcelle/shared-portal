'use server';

import { PolicyInfo } from '@/models/policy_info_details';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';

export async function getPolicyInfo(memCks: string[]): Promise<PolicyInfo> {
  try {
    const response = await memberService.get(
      `/api/v1/policyInfo?members=${memCks.join(',')}`,
    );
    logger.info('Get Policy Info Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Policy Info API', error);
    throw error;
  }
}
