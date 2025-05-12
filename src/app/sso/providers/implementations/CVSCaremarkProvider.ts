'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { getPrefix } from '@/utils/member_utils';
import { CVSCaremarkParameters } from '../../models/types';
import {
  CVS_ClientID_130449,
  CVS_DEFAULT_CLIENT_ID_VALUE,
} from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for CVSCaremark
 */
export default class CVSCaremarkProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK || 'cvs-caremark',
      'CVS Caremark',
    );
  }

  /**
   * Generate the parameters needed for CVSCaremark SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<CVSCaremarkParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subId = this.getCVSSubID(member);

      const params: CVSCaremarkParameters = {
        firstName: member.firstName,
        lastName: member.lastName,
        subject: subId,
        clientId: this.getCVSClient(member),
        dateOfBirth: formatDateString(
          member.dateOfBirth,
          'MM/dd/yyyy',
          'yyyyMMdd',
        ),
      };

      // Additional CVSCaremark-specific parameters that don't map directly to our interface
      const additionalParams = {
        gender: member.gender,
        personId: subId,
      };

      // Combine the two objects
      return {
        ...params,
        ...additionalParams,
      } as CVSCaremarkParameters;
    }, 'Error generating CVSCaremark SSO parameters');
  }

  /**
   * Get the subscriber ID for CVS Caremark
   */
  private getCVSSubID(member: LoggedInMember): string {
    let subID = '';

    if (member.lob?.toUpperCase() === 'MEDC') {
      subID += getPrefix(member);
      subID += member.subscriberId || '';
    } else {
      subID += member.subscriberId || '';
    }

    return subID;
  }

  /**
   * Get the client ID for CVS Caremark
   */
  private getCVSClient(member: LoggedInMember): string {
    if (
      member.groupDetails.groupID !== null &&
      member.groupDetails.groupID === '130499'
    ) {
      return CVS_ClientID_130449;
    }
    return CVS_DEFAULT_CLIENT_ID_VALUE;
  }

  supportsDropOff(): boolean {
    return true;
  }
}
