'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatMemberId } from '@/utils/member_utils';
import {
  MAIN,
  SCHEDULE,
  SCHEDULER,
  SSO_DOB,
  SSO_EMPLOYEE_ID,
  SSO_FIRST_NAME,
  SSO_GROUP_NUMBER,
  SSO_LANDING_PAGE,
  SSO_LAST_NAME,
  SSO_SUBJECT,
} from '../ssoConstants';

export default async function generatePremiseHealthMap(
  memberData: LoggedInMember,
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generatePremiseHealthMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need to get from request param
  const target = searchParams?.target ?? '';

  //TO DO: Need to check const value target & schedule doesn't match so it will always falls in else condition
  if (target == SCHEDULE) {
    ssoParamMap.set(SSO_LANDING_PAGE, SCHEDULER);
  } else {
    ssoParamMap.set(SSO_LANDING_PAGE, MAIN);
  }

  ssoParamMap.set(
    SSO_EMPLOYEE_ID,
    formatMemberId(memberData.subscriberId, memberData.suffix),
  );
  ssoParamMap.set(SSO_FIRST_NAME, memberData.firstName);
  ssoParamMap.set(SSO_LAST_NAME, memberData.lastName);
  ssoParamMap.set(SSO_DOB, memberData.dateOfBirth);

  ssoParamMap.set(SSO_GROUP_NUMBER, memberData.groupId);
  ssoParamMap.set(SSO_SUBJECT, memberData.subscriberId);

  console.log('generatePremiseHealthMap exited !!!');
  return ssoParamMap;
}
