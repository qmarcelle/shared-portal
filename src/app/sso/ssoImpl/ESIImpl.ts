'use server';

import { MemberData } from '@/actions/loggedUserInfo';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString, formatDateToGiven } from '@/utils/date_formatter';
import { getMemberDetails, getSubscriberSuffix } from '@/utils/member_utils';
import {
  SSO_DATE_TIME,
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_ID,
  SSO_LAST_NAME,
  SSO_REDIRECT,
  SSO_RELATIONSHIP_CODE,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
  SSO_USER_DOB,
  SSO_USER_EMAIL,
  SSO_USER_FIRST_NAME,
  SSO_USER_ID,
  SSO_USER_LAST_NAME,
} from '../ssoConstants';

export default async function generateESISSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateESISSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need to get from RequestParam
  const esiDeepLink = '';
  const relationshipCode = '';
  const dependentMemeCk = '';
  //To Do: Need to getEmailAddress from UserManagementDelegate
  const emailId = '';
  const dependent: MemberData | undefined = await getMemberDetails(
    memberData.memeCk,
    Number(dependentMemeCk),
  );
  const memberId = getSubscriberSuffix(
    memberData.subscriberId,
    dependent ? dependent.suffix : memberData.suffix,
  );

  ssoParamMap.set(SSO_ID, memberId);
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(
    SSO_DOB,
    formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'yyyyMMdd'),
  );
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_USER_ID, memberData.userId);

  // Member Level Data
  ssoParamMap.set(SSO_RELATIONSHIP_CODE, relationshipCode);
  ssoParamMap.set(
    SSO_USER_FIRST_NAME,
    (dependent ? dependent.firstName : memberData.firstName) ?? '',
  );
  ssoParamMap.set(
    SSO_USER_LAST_NAME,
    (dependent ? dependent.lastName : memberData.lastName) ?? '',
  );
  ssoParamMap.set(
    SSO_USER_DOB,
    formatDateString(
      dependent ? dependent.dob : memberData.dateOfBirth,
      'MM/dd/yyyy',
      'yyyyMMdd',
    ),
  );
  ssoParamMap.set(SSO_USER_EMAIL, emailId);

  ssoParamMap.set(
    SSO_REDIRECT,
    '<ContentArea>' + esiDeepLink + '</ContentArea>',
  );
  ssoParamMap.set(
    SSO_DATE_TIME,
    formatDateToGiven(
      undefined,
      'short',
      'numeric',
      'numeric',
      'numeric',
      '2-digit',
      '2-digit',
      'short',
    ),
  );

  ssoParamMap.set(SSO_SUBJECT, 'bcbstuser');
  ssoParamMap.set(SSO_TARGET_RESOURCE, process.env.ESI_SSO_TARGET ?? '');

  console.log('generateESISSOMap exited !!!');
  return ssoParamMap;
}
