'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId } from '@/utils/member_utils';
import { ChipRewardsParameters } from '../../models/types';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for ChipRewards
 */
export default class ChipRewardsProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS || 'chip-rewards',
      'Chip Rewards',
    );
  }

  /**
   * Generate the parameters needed for ChipRewards SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<ChipRewardsParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const memId = formatMemberId(member.subscriberId, member.suffix);

      const params: ChipRewardsParameters = {
        subject: memId,
      };

      return params;
    }, 'Error generating ChipRewards SSO parameters');
  }

  supportsDropOff(): boolean {
    return true;
  }
}
