'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId } from '@/utils/member_utils';
import { SSO_SUBJECT } from '../ssoConstants';

export default async function generateChipRewardsSSOMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateChipRewardsMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }
  const memId = formatMemberId(memberData.subscriberId, memberData.suffix);
  ssoParamMap.set(SSO_SUBJECT, memId);

  console.log('generateChipRewardsMap ended !!!');
  return ssoParamMap;
}
