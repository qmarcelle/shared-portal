

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { EyemedParameters } from '../../models/types';
import {
  EYEMED_DEEPLINK_MAP,
  EYEMED_SSO_CLIENT_ID_VALUE,
} from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Eyemed
 */
export default class EyemedProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_EYEMED || 'eyemed', 'Eyemed');
  }

  /**
   * Generate the parameters needed for Eyemed SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<EyemedParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const targetResource = searchParams?.targetResource || '';
      const deepLink = EYEMED_DEEPLINK_MAP.get(targetResource) || '';

      const params: EyemedParameters = {
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
        clientId: EYEMED_SSO_CLIENT_ID_VALUE,
        targetResource: deepLink,
      };

      return params;
    }, 'Error generating Eyemed SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
