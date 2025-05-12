

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getPlanId, getSubscriberSuffix } from '@/utils/member_utils';
import { TeladocParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Teladoc
 */
export default class TeladocProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_TELADOC || 'teladoc', 'Teladoc');
  }

  /**
   * Generate the parameters needed for Teladoc SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<TeladocParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: TeladocParameters = {
        subscriberId: subscriberId,
        firstName: member.firstName.toLocaleUpperCase().trim(),
        lastName: member.lastName.toLocaleUpperCase().trim(),
        dateOfBirth: formatDateString(
          member.dateOfBirth,
          'MM/dd/yyyy',
          'yyyy-MM-dd',
        ),
        memberId: subscriberId,
        subject: subscriberId,
        planId: getPlanId(member),
      };

      return params;
    }, 'Error generating Teladoc SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
