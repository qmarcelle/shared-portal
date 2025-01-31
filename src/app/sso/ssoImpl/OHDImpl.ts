'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import {
  getGender,
  getMemberRelation,
  getOrganization,
  isEligible,
} from '@/utils/member_utils';
import {
  SSO_EMPLOYEE_ID,
  SSO_FIRST_NAME,
  SSO_GENDER,
  SSO_LAST_NAME,
  SSO_ORGANIZATION,
  SSO_RELATIONSHIP,
  SSO_SUBJECT,
} from '../ssoConstants';

export default async function generateOHDMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateOHDMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_GENDER, getGender(memberData.gender));
  ssoParamMap.set(SSO_RELATIONSHIP, getMemberRelation(memberData.memRelation));
  ssoParamMap.set(
    SSO_ORGANIZATION,
    getOrganization(
      isEligible(memberData, 'OHDFullyInsured'),
      memberData.groupId,
    ),
  );
  ssoParamMap.set(SSO_EMPLOYEE_ID, memberData.subscriberId);
  ssoParamMap.set(SSO_SUBJECT, memberData.userId);

  console.log('generateOHDMap exited !!!');
  return ssoParamMap;
}
