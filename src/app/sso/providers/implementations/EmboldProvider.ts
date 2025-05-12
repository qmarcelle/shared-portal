'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { EmboldParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Embold
 */
export default class EmboldProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_EMBOLD || 'embold', 'Embold');
  }

  /**
   * Generate the parameters needed for Embold SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<EmboldParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: EmboldParameters = {
        subject: subscriberId,
        lastName: member.lastName,
        gender: member.gender,
        clientId: process.env.EMBOLD_CLIENT_ID || '',
        dateOfBirth: formatDateString(
          member.dateOfBirth,
          'MM/dd/yyyy',
          'yyyy-MM-dd',
        ),
      };

      return params;
    }, 'Error generating Embold SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
