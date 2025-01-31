'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { SSO_INSURED_ID, SSO_SUBJECT } from '../ssoConstants';

export default async function generateHealthEquitySSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateHealthEquitySSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }
  ssoParamMap.set(SSO_INSURED_ID, memberData.subscriberId);
  ssoParamMap.set(
    SSO_SUBJECT,
    memberData.firstName.substring(0, 1) +
      memberData.middleIntital +
      memberData.lastName,
  );

  console.log('generateHealthEquitySSOMap ended !!!');
  return ssoParamMap;
}
