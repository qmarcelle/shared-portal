'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getPrefix } from '@/utils/member_utils';
import {
  SSO_ALPHA_PREFIX,
  SSO_BIRTH_YEAR,
  SSO_FIRST_NAME,
  SSO_GENDER,
  SSO_LAST_NAME,
  SSO_TARGET_RESOURCE,
  SSO_ZIP_CODE,
} from '../ssoConstants';

export default async function generateBlue365Map(
  memberData: LoggedInMember,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateBlue365Map entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  ssoParamMap.set(SSO_ALPHA_PREFIX, getPrefix(memberData));
  ssoParamMap.set(SSO_ZIP_CODE, memberData.contact.zipcode.substring(0, 5));
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName.substring(0, 63));
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName.substring(0, 63));
  ssoParamMap.set(SSO_GENDER, memberData.gender);
  ssoParamMap.set(SSO_BIRTH_YEAR, memberData.dateOfBirth.substring(0, 6));
  ssoParamMap.set(SSO_TARGET_RESOURCE, process.env.BLUE_365_SSO_TARGET ?? '');
  //ssoParamMap.set(SSO_SUBJECT, email);

  console.log('generateBlue365Map exited !!!');
  return ssoParamMap;
}
