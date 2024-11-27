'use server';

import { auth } from '@/auth';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';
import { PrimaryCareProviderDetails } from '../model/api/primary_care_provider';

export async function getPCPInfo(
  session?: Session | null,
): Promise<PrimaryCareProviderDetails> {
  try {
    const memberDetails = session ?? (await auth());
    const response = await portalSvcsApi.get(
      `/memberservice/PCPhysicianService/pcPhysician/${memberDetails?.user.currUsr?.plan.memCk}`,
    );
    logger.info('Get PCP Physician Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from GetPCPInfo API', error);
    throw error;
  }
}
