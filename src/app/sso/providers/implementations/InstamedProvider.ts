'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { InstamedParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Instamed
 */
export default class InstamedProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_INSTAMED || 'instamed', 'Instamed');
  }

  /**
   * Generate the parameters needed for Instamed SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<InstamedParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      // Extract payment details from search params
      const {
        amountDue = '',
        claimNumber = '',
        claimReferenceNumber = '',
        patientFirstName = '',
        patientLastName = '',
        patientId = '',
        patientServiceBeginDate = '',
        patientServiceEndDate = '',
        payToProviderName = '',
        payToProviderAddress = '',
        payToProviderCity = '',
        payToProviderState = '',
        payToProviderZip = '',
        providerBillingTin = '',
        renderingProvider = '',
      } = searchParams || {};

      const params: InstamedParameters = {
        subject: subscriberId,
        amountDue,
        claimNumber,
        claimReferenceNumber,
        patientFirstName,
        patientLastName,
        patientId,
        patientServiceBeginDate,
        patientServiceEndDate,
        payToProviderName,
        payToProviderAddress,
        payToProviderCity,
        payToProviderState,
        payToProviderZip,
        providerBillingTin,
        renderingProvider,
      };

      return params;
    }, 'Error generating Instamed SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
