'use server';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { logger } from '@/utils/logger';
import { SSOService } from '../services/SSOService';
import dropOffToPing from './pingDropOff';

/**
 * Server action for posting to Ping to get a reference ID
 */
export default async function ssoToPing(
  providerId: string,
  searchParams: { [k: string]: string },
): Promise<string> {
  try {
    logger.info(`Initiating SSO to Ping for provider: ${providerId}`);

    const session = await auth();
    const memberDetails = await getLoggedInMember(session);

    if (!memberDetails) {
      throw new Error('Member details not available');
    }

    // Generate SSO parameters using the SSOService
    const ssoParamMap = await SSOService.generateParameters(
      providerId,
      memberDetails,
      searchParams,
    );

    logger.info('Generated SSO parameters for provider', {
      providerId,
      paramCount: ssoParamMap.size,
    });

    // Call Ping API to get the reference ID
    const ref = await dropOffToPing(ssoParamMap);

    if (!ref) {
      throw new Error('Reference ID not returned from Ping');
    }

    return ref;
  } catch (error) {
    logger.error('Error in ssoToPing', { providerId, error });
    throw error;
  }
}
