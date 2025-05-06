'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { SSO_FED_ID, SSO_KEY, SSO_SUBJECT } from '../ssoConstants';

export default async function generateHSABankMap(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateHSABankMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const ssn = memberData.ssn;
  ssoParamMap.set(SSO_KEY, ssn);
  ssoParamMap.set(SSO_FED_ID, memberData.groupEIN);
  ssoParamMap.set(SSO_SUBJECT, ssn);

  console.log('generateHSABankMap exited !!!');
  return ssoParamMap;
}
