'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { logger } from '@/utils/logger';
import { challengeDropOffToPing } from '../actions/pingDropOff';
import { BaseSSOParameters } from '../models/types';
import { ProviderFactory } from '../providers/ProviderFactory';

/**
 * Service class for SSO operations
 */
export class SSOService {
  /**
   * Perform drop-off SSO to Ping
   */
  static async performDropOffSSO(providerId: string): Promise<string> {
    try {
      const session = await auth();
      const member = await getLoggedInMember(session);

      // Validate member data
      if (!member) {
        throw new Error('Member data not available');
      }

      // Get provider and parameters
      const provider = ProviderFactory.getProvider(providerId);
      const parameters = await provider.generateParameters(member);

      // Convert parameters to Map for the Ping API
      const paramMap = this.convertToMap(parameters);

      // Call Ping API to get reference ID
      const referenceId = await challengeDropOffToPing(paramMap);

      if (!referenceId) {
        throw new Error('Failed to get reference ID from Ping');
      }

      return referenceId;
    } catch (error) {
      logger.error('Error in performDropOffSSO', error);
      throw error;
    }
  }

  /**
   * Generate SSO parameters for a specific provider
   */
  static async generateParameters(
    providerId: string,
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<Map<string, string>> {
    try {
      const provider = ProviderFactory.getProvider(providerId);
      const parameters = await provider.generateParameters(
        member,
        searchParams,
      );
      return this.convertToMap(parameters);
    } catch (error) {
      logger.error(`Error generating SSO parameters for ${providerId}`, error);
      throw error;
    }
  }

  /**
   * Convert parameters object to a Map<string, string>
   */
  private static convertToMap(params: BaseSSOParameters): Map<string, string> {
    const map = new Map<string, string>();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        map.set(key, value.toString());
      }
    });

    return map;
  }

  /**
   * Check if a provider supports drop-off SSO
   */
  static supportsDropOff(providerId: string): boolean {
    return ProviderFactory.supportsDropOff(providerId);
  }

  /**
   * Get the display name for a provider
   */
  static getProviderName(providerId: string): string {
    return ProviderFactory.getProviderName(providerId);
  }
}
