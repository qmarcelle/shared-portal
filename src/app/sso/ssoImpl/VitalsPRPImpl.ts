'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId } from '@/utils/member_utils';
import {
  SSO_MEMBER_ID,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
  SSO_USER_ID,
} from '../ssoConstants';

export default async function generateVitalsPRPSSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateVitalsPRPSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need to get from Request Param
  const provId = '';
  const targetURL = process.env.VITALS_PRP_SSO_TARGET ?? '';
  const finalTargetUrl = targetURL.replace('{PROV_ID}', provId);

  const memberId = formatMemberId(memberData.subscriberId, memberData.suffix);

  ssoParamMap.set(SSO_MEMBER_ID, memberId);
  ssoParamMap.set(SSO_USER_ID, memberData.userId);
  ssoParamMap.set(SSO_TARGET_RESOURCE, finalTargetUrl);
  ssoParamMap.set(SSO_SUBJECT, memberId);

  console.log('generateVitalsPRPSSOMap exited !!!');
  return ssoParamMap;
}
