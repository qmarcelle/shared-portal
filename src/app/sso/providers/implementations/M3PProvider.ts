

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { M3PParameters } from '../../models/types';
import {
  CLIENT_ID_MANAGEMENT,
  CLIENT_ID_PREVENTION,
  PROGRAM_ID_DIABETES,
  PROGRAM_ID_HYPERTENSION,
  PROGRAM_ID_PREDIABETES,
  TARGET_DIABETES,
  TARGET_HYPERTENSION,
  TARGET_PREDIABETES,
} from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for M3P
 */
export default class M3PProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_M3P || 'm3p', 'M3P');
  }

  /**
   * Generate the parameters needed for M3P SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<M3PParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      const programId = searchParams?.programId || '';
      const target = this.getTarget(programId);

      const params: M3PParameters = {
        subject: subscriberId,
        clientId: this.getClientId(programId),
        programId: programId,
        target: target,
      };

      return params;
    }, 'Error generating M3P SSO parameters');
  }

  /**
   * Get the client ID based on the program ID
   */
  private getClientId(programId: string): string {
    if (programId === PROGRAM_ID_PREDIABETES) {
      return CLIENT_ID_PREVENTION;
    }
    return CLIENT_ID_MANAGEMENT;
  }

  /**
   * Get the target based on the program ID
   */
  private getTarget(programId: string): string {
    switch (programId) {
      case PROGRAM_ID_DIABETES:
        return TARGET_DIABETES;
      case PROGRAM_ID_PREDIABETES:
        return TARGET_PREDIABETES;
      case PROGRAM_ID_HYPERTENSION:
        return TARGET_HYPERTENSION;
      default:
        return '';
    }
  }

  supportsDropOff(): boolean {
    return true;
  }
}
