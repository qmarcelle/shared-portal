

import { LoggedInMember } from '@/models/app/loggedin_member';
import { ElectronicPaymentBOAParameters } from '../../models/types';
import { BOA_PARTNER_KEY, BOA_PARTNER_KEY_SIGNATURE } from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Electronic Payment BOA
 */
export default class ElectronicPaymentBOAProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA ||
        'electronic-payment-boa',
      'Electronic Payment BOA',
    );
  }

  /**
   * Generate the parameters needed for Electronic Payment BOA SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<ElectronicPaymentBOAParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const amountDue = searchParams?.amountDue || '';
      const claimNumber = searchParams?.claimNumber || '';
      const accountNumber = searchParams?.accountNumber || '';
      const currentBalance = searchParams?.currentBalance || '';
      const currentStatementBalance =
        searchParams?.currentStatementBalance || '';
      const paymentDueDate = searchParams?.paymentDueDate || '';
      const partnerSessionId = searchParams?.partnerSessionId || '';
      const timeStamp = new Date().getTime().toString();

      const partnerKey = this.getPartnerKey(member.groupId);
      const partnerSigKey = this.getPartnerSigKey(partnerKey);

      const params: ElectronicPaymentBOAParameters = {
        subject: member.userId,
        accountNumber: accountNumber,
        currentBalance: currentBalance,
        currentStatementBalance: currentStatementBalance,
        dateTime: timeStamp,
        partnerId: member.groupId,
        partnerKey: partnerKey,
        partnerSessionId: partnerSessionId,
        partnerSignatureKey: partnerSigKey,
        paymentDueDate: paymentDueDate,
        timeStamp: timeStamp,
      };

      return params;
    }, 'Error generating Electronic Payment BOA SSO parameters');
  }

  /**
   * Get the partner key based on group ID
   */
  private getPartnerKey(groupId: string): string {
    if (groupId.toLowerCase() === 'cobra') {
      return BOA_PARTNER_KEY.get('cobra') || '';
    }

    return BOA_PARTNER_KEY.get(groupId.substring(0, 6)) || '';
  }

  /**
   * Get the partner signature key based on partner key
   */
  private getPartnerSigKey(partnerKey: string): string {
    return BOA_PARTNER_KEY_SIGNATURE.get(partnerKey) || '';
  }

  supportsDropOff(): boolean {
    return true;
  }
}
