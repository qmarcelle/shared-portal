import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { HSABankParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for HSA Bank
 */
export default class HSABankProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_HSA_BANK || 'hsa-bank', 'HSA Bank');
  }

  /**
   * Generate the parameters needed for HSA Bank SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<HSABankParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const params: HSABankParameters = {
        subject: subscriberId,
        firstName: member.firstName,
        lastName: member.lastName,
      };

      return params;
    }, 'Error generating HSA Bank SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
