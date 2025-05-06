'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { formatMemberId } from '@/utils/member_utils';
import {
  EYEMED_SSO_CLIENT_ID_VALUE,
  SSO_CLIENT_ID,
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_LAST_NAME,
  SSO_MEMBER_ID,
  SSO_SUBJECT,
} from '../ssoConstants';

export default async function generateEyemedSSOMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateEyemedSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  // change the map keys value to all lower case
  const memId = formatMemberId(memberData.subscriberId, memberData.suffix);
  ssoParamMap.set(SSO_MEMBER_ID, memId);
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(
    SSO_DOB,
    formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'yyyyMMdd'),
  );
  ssoParamMap.set(SSO_CLIENT_ID, EYEMED_SSO_CLIENT_ID_VALUE);
  ssoParamMap.set(SSO_SUBJECT, memId);

  console.log('generateEyemedSSOMap exited !!!');
  return ssoParamMap;
}
