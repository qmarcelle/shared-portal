

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { PremiseHealthParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Premise Health
 */
export default class PremiseHealthProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH || 'premise-health',
      'Premise Health',
    );
  }

  /**
   * Generate the parameters needed for Premise Health SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<PremiseHealthParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: PremiseHealthParameters = {
        subject: subscriberId,
        employerId: member.groupId,
        employeeId: member.subscriberId,
        birthYear: member.dateOfBirth.substring(6),
        zipCode: member.contact.zipcode.substring(0, 5),
        firstName: member.firstName,
        lastName: member.lastName,
      };

      return params;
    }, 'Error generating Premise Health SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
