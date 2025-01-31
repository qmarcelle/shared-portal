'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { isEligible } from '@/utils/member_utils';
import {
  MD_LIVE_OU,
  MD_LIVE_OU_GROUPS,
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_GENDER,
  SSO_LAST_NAME,
  SSO_SUBJECT,
  SSO_SUBSCRIBER_ID,
  SSO_TARGET_RESOURCE,
} from '../ssoConstants';

export default async function generateMDLiveSSOMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateMDLiveSSOMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  const subId = getSubscriberId(memberData);

  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName.trim());
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName.trim());
  ssoParamMap.set(SSO_GENDER, getGender(memberData.gender));
  ssoParamMap.set(
    SSO_DOB,
    formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'dd-MM-yyyy'),
  );
  ssoParamMap.set(SSO_SUBSCRIBER_ID, subId);
  ssoParamMap.set(SSO_SUBJECT, subId);
  ssoParamMap.set(MD_LIVE_OU, getOUDetails(memberData));
  ssoParamMap.set(
    SSO_TARGET_RESOURCE,
    process.env.MDLIVE_SSO_TARGET ? process.env.MDLIVE_SSO_TARGET : '',
  );

  console.log('generateMDLiveSSOMap exited !!!');
  return ssoParamMap;
}

function getSubscriberId(memberData: LoggedInMember) {
  if (
    memberData.networkPrefix !== null ||
    memberData.networkPrefix !== undefined
  ) {
    return memberData.networkPrefix.trim() + memberData.subscriberId;
  }
  return memberData.subscriberId;
}

function getGender(gender: string) {
  if (gender && gender.trim().length > 0) {
    gender = gender.toUpperCase() === 'M' ? 'Male' : 'Female';
  }
  return gender;
}

function getOUDetails(memberData: LoggedInMember) {
  let ou = '';
  if (
    memberData.lob.toUpperCase() === 'REGL' &&
    !MD_LIVE_OU_GROUPS.split(',').includes(memberData.groupDetails.groupID)
  ) {
    ou = isEligible(memberData, 'FULLYINSURED') ? 'BCBSTFI' : 'BCBSTASO';
  } else {
    ou = 'BCBST-' + memberData.groupDetails.groupID;
  }
  return ou;
}
