'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { PinnacleBankParameters } from '../../models/types';
import { PINNACLE_ACCOUNT_TYPE_CONSUMER } from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Pinnacle Bank
 */
export default class PinnacleBankProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK || 'pinnacle-bank',
      'Pinnacle Bank',
    );
  }

  /**
   * Generate the parameters needed for Pinnacle Bank SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<PinnacleBankParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: PinnacleBankParameters = {
        subject: subscriberId,
        accountType: PINNACLE_ACCOUNT_TYPE_CONSUMER,
      };

      return params;
    }, 'Error generating Pinnacle Bank SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
