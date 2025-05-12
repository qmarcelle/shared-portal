'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import { OnLifeParameters } from '../../models/types';
import {
  ON_LIFE_CHALLENGE,
  ON_LIFE_CHALLENGE_DETAILS_PATH,
  ON_LIFE_ELIGIBLE_GROUPS,
  ON_LIFE_PHA,
} from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for OnLife
 */
export default class OnLifeProvider extends BaseProvider {
  constructor() {
    super(process.env.NEXT_PUBLIC_IDP_ON_LIFE || 'on-life', 'On Life');
  }

  /**
   * Generate the parameters needed for OnLife SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<OnLifeParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      // Determine target and challenge ID
      let targetParam = '';
      let challengeId = '';

      if (member.groupId === ON_LIFE_ELIGIBLE_GROUPS) {
        const target = searchParams?.target || '';

        if (target === ON_LIFE_CHALLENGE) {
          targetParam = ON_LIFE_CHALLENGE_DETAILS_PATH;
          challengeId = searchParams?.challengeId || '';
        } else if (target === ON_LIFE_PHA) {
          targetParam = process.env.ON_LIFE_PHA_PATH || '';
        }
      }

      const params: OnLifeParameters = {
        subject: subscriberId,
        targetParam,
        challengeId,
      };

      return params;
    }, 'Error generating OnLife SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
