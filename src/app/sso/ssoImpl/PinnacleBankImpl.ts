'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import {
  PINNACLE_ACCOUNT_TYPE_CONSUMER,
  SSO_ACCOUNT_TYPE,
  SSO_EMPLOYER_CODE,
  SSO_SUBJECT,
  SSO_USER_ID,
} from '../ssoConstants';

export default async function generatePinnacleBankMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generatePinnacleBankMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const ssn = memberData.ssn;
  ssoParamMap.set(SSO_USER_ID, ssn);
  ssoParamMap.set(SSO_EMPLOYER_CODE, memberData.groupId.padStart(6, '0'));
  ssoParamMap.set(SSO_ACCOUNT_TYPE, PINNACLE_ACCOUNT_TYPE_CONSUMER);
  ssoParamMap.set(SSO_SUBJECT, ssn);

  console.log('generatePinnacleBankMap exited !!!');
  return ssoParamMap;
}
