import { logger } from '@/utils/logger';
import { SSOEnvironmentConfig } from '../config';
import { SSOService } from './SSOService';

/**
 * Service for generating SSO URLs
 */
export class URLService {
  /**
   * Generate a complete drop-off SSO URL
   */
  static async generateDropOffSSOUrl(
    providerId: string,
    searchParams?: Record<string, string>,
  ): Promise<string> {
    try {
      // Get the reference ID from the SSO service
      const referenceId = await SSOService.performDropOffSSO(providerId);

      // Build the final SSO URL
      return `${SSOEnvironmentConfig.pingDropOffUrl}spEntityId=${providerId}&challenge=${referenceId}`;
    } catch (error) {
      logger.error('Error generating drop-off SSO URL', { providerId, error });
      throw error;
    }
  }

  /**
   * Generate a direct SSO URL
   */
  static buildDirectSSOUrl(searchParams: string): string {
    return `${SSOEnvironmentConfig.pingRestUrl}/idp/startSSO.ping?${searchParams}`;
  }

  /**
   * Generate the appropriate SSO URL based on provider type
   */
  static async generateSSOUrl(
    providerId: string,
    searchParamsString: string,
    searchParams?: Record<string, string>,
  ): Promise<string> {
    // Check if this provider uses drop-off SSO
    if (SSOService.supportsDropOff(providerId)) {
      return await this.generateDropOffSSOUrl(providerId, searchParams);
    }

    // Otherwise, use direct SSO
    return this.buildDirectSSOUrl(searchParamsString);
  }
}
