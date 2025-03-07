'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';

import { formatDateString } from '@/utils/date_formatter';
import { getPrefix } from '@/utils/member_utils';
import {
  CVS_ClientID_130449,
  CVS_DEFAULT_CLIENT_ID_VALUE,
  SSO_CLIENT_ID,
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_GENDER,
  SSO_LAST_NAME,
  SSO_PERSON_ID,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
} from '../ssoConstants';

export default async function generateCVSCaremarkSSOMap(
  memberData: LoggedInMember,
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateCVSCaremarkSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const target = searchParams?.target ?? '';
  const subId = getCVSSubID(memberData);
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_GENDER, memberData.gender);
  ssoParamMap.set(
    SSO_DOB,
    formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'yyyyMMdd'),
  );
  ssoParamMap.set(SSO_PERSON_ID, subId);
  ssoParamMap.set(SSO_CLIENT_ID, getCVSClient(memberData));
  ssoParamMap.set(SSO_SUBJECT, subId);
  ssoParamMap.set(SSO_TARGET_RESOURCE, target);

  console.log('generateCVSCaremarkSSOMap exited !!!');
  return ssoParamMap;
}

// Utility function to get the subscriber ID
function getCVSSubID(memberData: LoggedInMember) {
  let subID = '';

  if (memberData.lob?.toUpperCase() === 'MEDC') {
    subID += getPrefix(memberData);
    subID += memberData.subscriberId || '';
  } else {
    subID += memberData.subscriberId || '';
  }

  return subID;
}

function getCVSClient(memberData: LoggedInMember) {
  if (
    memberData.groupDetails.groupID !== null &&
    memberData.groupDetails.groupID === '130499'
  ) {
    return CVS_ClientID_130449;
  }
  return CVS_DEFAULT_CLIENT_ID_VALUE;
}
