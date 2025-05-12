'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getPrefix } from '@/utils/member_utils';
import { Blue365Parameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Blue365
 */
export default class Blue365Provider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_BLUE_365 || 'blue365', 'Blue 365');
  }

  /**
   * Generate the parameters needed for Blue365 SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<Blue365Parameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const params: Blue365Parameters = {
        subject: member.userId,
        firstName: member.firstName.substring(0, 63),
        lastName: member.lastName.substring(0, 63),
        targetResource: process.env.BLUE_365_SSO_TARGET || '',
      };

      // Additional Blue365-specific parameters that don't map directly to our interface
      const additionalParams = {
        alphaPrefix: getPrefix(member),
        zipCode: member.contact.zipcode.substring(0, 5),
        gender: member.gender,
        birthYear: member.dateOfBirth.substring(6),
      };

      // Combine the two objects
      return {
        ...params,
        ...additionalParams,
      } as Blue365Parameters;
    }, 'Error generating Blue365 SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
