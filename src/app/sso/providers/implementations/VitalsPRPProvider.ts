'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getPlanId, getSubscriberSuffix } from '@/utils/member_utils';
import { VitalsPRPParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for VitalsPRP
 */
export default class VitalsPRPProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_VITALSPRP || 'vitals-prp', 'Vitals PRP');
  }

  /**
   * Generate the parameters needed for VitalsPRP SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<VitalsPRPParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: VitalsPRPParameters = {
        subject: subscriberId,
        subscriberId: subscriberId,
        firstName: member.firstName,
        lastName: member.lastName,
        dateOfBirth: formatDateString(
          member.dateOfBirth,
          'MM/dd/yyyy',
          'yyyy-MM-dd',
        ),
        planId: getPlanId(member),
      };

      return params;
    }, 'Error generating VitalsPRP SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
