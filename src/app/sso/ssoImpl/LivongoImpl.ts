'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId, isEligible } from '@/utils/member_utils';
import {
  CLIENT_ID_FULL,
  CLIENT_ID_MANAGEMENT,
  CLIENT_ID_PREVENTION,
  LIVONGO_REG_CODE,
  PROGRAM_ID_BEHAVIORAL,
  PROGRAM_ID_DIABETES,
  PROGRAM_ID_HYPERTENSION,
  PROGRAM_ID_PREDIABETES,
  SSO_CLIENT_ID,
  SSO_DOB,
  SSO_EMAIL_ADDRESS,
  SSO_FIRST_NAME,
  SSO_GENDER,
  SSO_LAST_NAME,
  SSO_MEMBER_ID,
  SSO_PROGRAM_ID,
  SSO_SUBJECT,
  SSO_ZIP_CODE,
  TARGET_BEHAVIORAL,
  TARGET_DIABETES,
  TARGET_HYPERTENSION,
  TARGET_PREDIABETES,
} from '../ssoConstants';

export default async function generateLivongoMap(
  memberData: LoggedInMember,
): Promise<Map<string, string>> {
  console.log('generateLivongoMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need t get from Request Param
  const target = '';

  const memberId = formatMemberId(memberData.subscriberId, memberData.suffix);
  ssoParamMap.set(SSO_MEMBER_ID, memberId);
  ssoParamMap.set(SSO_CLIENT_ID, getClientId(memberData));
  ssoParamMap.set(SSO_PROGRAM_ID, getPROGRAM_ID(target, memberData));

  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_EMAIL_ADDRESS, memberData.contact.email);
  ssoParamMap.set(SSO_GENDER, memberData.gender);
  ssoParamMap.set(SSO_ZIP_CODE, memberData.contact.zipcode);
  ssoParamMap.set(SSO_DOB, memberData.dateOfBirth);
  ssoParamMap.set(SSO_SUBJECT, memberId);

  console.log('generateLivongoMap exited !!!');
  return ssoParamMap;
}

const getClientId = (memberData: LoggedInMember): string => {
  const regCode = LIVONGO_REG_CODE.get(memberData.groupId);
  if (regCode != null) {
    return regCode;
  }

  if (
    (isEligible(memberData, 'TELADOC_DIABETESMGMT') &&
      isEligible(memberData, 'TELADOC_DIABETESPREVENTION')) ||
    isEligible(memberData, 'TELADOC_HYPERTENSIONMGMT') ||
    isEligible(memberData, 'TELADOC_MYSTRENGTHCOMPLETE')
  ) {
    return CLIENT_ID_FULL;
  }
  if (isEligible(memberData, 'TELADOC_DIABETESMGMT')) {
    return CLIENT_ID_MANAGEMENT;
  }
  if (isEligible(memberData, 'TELADOC_DIABETESPREVENTION')) {
    return CLIENT_ID_PREVENTION;
  }
  return '';
};

const getPROGRAM_ID = (target: string, memberData: LoggedInMember): string => {
  switch (target) {
    case TARGET_DIABETES:
      return isEligible(memberData, 'TELADOC_DIABETESMGMT')
        ? PROGRAM_ID_DIABETES
        : '';
    case TARGET_PREDIABETES:
      return isEligible(memberData, 'TELADOC_DIABETESPREVENTION')
        ? PROGRAM_ID_PREDIABETES
        : '';
    case TARGET_HYPERTENSION:
      return isEligible(memberData, 'TELADOC_HYPERTENSIONMGMT')
        ? PROGRAM_ID_HYPERTENSION
        : '';
    case TARGET_BEHAVIORAL:
      return isEligible(memberData, 'TELADOC_MYSTRENGTHCOMPLETE')
        ? PROGRAM_ID_BEHAVIORAL
        : '';
    default:
      return '';
  }
};
