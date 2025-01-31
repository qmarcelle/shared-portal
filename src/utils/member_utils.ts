import { MemberData } from '@/actions/loggedUserInfo';
import { getMemberAndDependents } from '@/actions/memberDetails';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { AuthFunction } from '@/models/member/api/loggedInUserInfo';

/**
 * Concatenate the subscriberId & suffix and returns the string
 * @param subscriberId Date format of an input date as a string
 * @param suffix Expected Date format as a string
 * @returns Concatenated String of subscriberId & suffix and append 0 before it
 */
export const formatMemberId = (
  subscriberId: string,
  suffix: number,
): string => {
  return `${subscriberId}${suffix.toString().padStart(2, '0')}`;
};

export const findAuthFuncByName = (
  memberData: LoggedInMember,
  name: string,
): AuthFunction | undefined => {
  return memberData?.authFunctions?.find((func) => func.functionName === name);
};

export const getSubscriberSuffix = (
  subscriberId: string,
  suffix: number,
): string => {
  return `${subscriberId.trim()}${suffix.toString().padStart(2, '0')}`;
};
export const getGender = (gender: string): string => {
  return gender.toLocaleUpperCase() === 'M' ? 'M' : 'F';
};

export const getMemberRelation = (relation: string): string => {
  return relation.toLocaleUpperCase() === 'M' ? 'Employee' : 'Dependent';
};

export const getOrganization = (
  isOHDFullyInsured: boolean,
  groupId: string,
): string => {
  return isOHDFullyInsured ? 'BCBST-FI' : groupId;
};

export const isEligible = (
  memberData: LoggedInMember,
  authName: string,
): boolean => {
  const authFunc = findAuthFuncByName(memberData, authName);

  return authFunc?.available ?? false;
};

export const getMemberDetails = async (
  memeCk: number,
  reqMemberCk: number,
): Promise<MemberData | undefined> => {
  // Get Members
  const members = await getMemberAndDependents(memeCk.toString());
  return members.find((member) => member.memberCK === reqMemberCk);
};

export const getPlanId = (memberData: LoggedInMember): string => {
  let planId = memberData.mpdpdId ?? '';
  if (memberData.isMedical) planId = memberData.mpdpdId ?? '';
  else if (memberData.isDental) planId = memberData.dpdpdId ?? '';
  else if (memberData.isVision) planId = memberData.vpdpdId ?? '';
  return planId;
};

export const getPrefix = (memberData: LoggedInMember): string => {
  const prefix = memberData.networkPrefix;
  if (prefix) return prefix;
  if (memberData.dpdpdId) return '297';
  if (memberData.vpdpdId) return '296';
  if (memberData.spdpdId) return '285';
  return '';
};
