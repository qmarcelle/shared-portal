'use server';

import { policyInfoMock } from '@/mock/policyInfoMock';
import { PolicyInfo } from '@/models/policy_info_details';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';

export async function getPolicyInfo(memCks: string[]): Promise<PolicyInfo> {
  try {
    const response = await portalSvcsApi.get(
      `/memberservice/api/v1/policyInfo?members=${memCks.join(',')}`,
    );
    logger.info('Get Policy Info Data', response?.data?.policyInfo);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from Policy Info API', error);
    return policyInfoMock;
  }
}
