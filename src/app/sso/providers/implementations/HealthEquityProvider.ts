'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { HealthEquityParameters } from '../../models/types';
import { PINNACLE_ACCOUNT_TYPE_CONSUMER } from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for HealthEquity
 */
export default class HealthEquityProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY || 'health-equity',
      'Health Equity',
    );
  }

  /**
   * Generate the parameters needed for HealthEquity SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<HealthEquityParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: HealthEquityParameters = {
        subject: subscriberId,
        personId: subscriberId,
        accountType: PINNACLE_ACCOUNT_TYPE_CONSUMER,
        employerCode: member.groupId,
      };

      return params;
    }, 'Error generating HealthEquity SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
