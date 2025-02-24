'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { formatMemberId } from '@/utils/member_utils';
import {
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_LAST_NAME,
  SSO_MEMBER_ID,
  SSO_SUBJECT,
} from '../ssoConstants';

export default async function generateTeladocMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateTeladocMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName.toString());
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName.toString());
  ssoParamMap.set(
    SSO_DOB,
    formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'MMddyyyy'),
  );
  const memberId = formatMemberId(memberData.subscriberId, memberData.suffix);
  ssoParamMap.set(SSO_MEMBER_ID, memberId);
  ssoParamMap.set(SSO_SUBJECT, memberId);

  console.log('generateTeladocMap exited !!!');
  return ssoParamMap;
}
