'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId, getPlanId } from '@/utils/member_utils';
import {
  SSO_DOB,
  SSO_GENDER,
  SSO_MEMBER_ID,
  SSO_PLAN_ID,
  SSO_SUBJECT,
} from '../ssoConstants';
export default async function generateEmboldSSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateEmboldSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const memId = formatMemberId(memberData.subscriberId, memberData.suffix);
  ssoParamMap.set(SSO_PLAN_ID, getPlanId(memberData));
  ssoParamMap.set(SSO_GENDER, memberData.gender);
  ssoParamMap.set(SSO_MEMBER_ID, memId);
  ssoParamMap.set(SSO_DOB, memberData.dateOfBirth);
  ssoParamMap.set(SSO_SUBJECT, memId);

  console.log('generateEmboldSSOMap exited !!!');
  return ssoParamMap;
}
