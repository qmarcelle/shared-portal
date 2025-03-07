'use server';

import { getMedicareId } from '@/actions/getMedicareId';
import { LoggedInMember } from '@/models/app/loggedin_member';
import {
  SSO_CUSTOMER_ID,
  SSO_FIRST_NAME,
  SSO_LAST_NAME,
  SSO_MEMBER_ID,
  SSO_SUBJECT,
  SSO_USER_ID,
  WIPRO_CUSTOMER_ID,
} from '../ssoConstants';

export default async function generateM3PMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateM3PMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const memberId = await getMedicareId(memberData.memeCk?.toString());
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_USER_ID, memberData.userId);
  ssoParamMap.set(SSO_MEMBER_ID, memberId);
  ssoParamMap.set(SSO_CUSTOMER_ID, WIPRO_CUSTOMER_ID);
  ssoParamMap.set(SSO_SUBJECT, memberData.userId);
  // sso email will be added to by pingone when we call the api to get the challengeid
  console.log('generateM3PMap exited !!!');
  return ssoParamMap;
}
