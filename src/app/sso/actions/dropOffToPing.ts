'use server';
import { logger } from '@/utils/logger';
import { SSOService } from '../services/SSOService';

export default async function ssoDropOffToPing(
  providerId: string,
): Promise<string> {
  try {
    logger.info(`Initiating SSO drop-off for provider: ${providerId}`);

    // Use the SSOService to perform drop-off SSO
    const referenceId = await SSOService.performDropOffSSO(providerId);

    logger.info(`Successfully generated referenceId for ${providerId}`);
    return referenceId;
  } catch (error) {
    logger.error('Error in ssoDropOffToPing', error);
    throw error;
  }
}
