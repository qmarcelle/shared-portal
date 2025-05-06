'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { getSubscriberSuffix } from '@/utils/member_utils';
import {
  ON_LIFE_CHALLENGE,
  ON_LIFE_CHALLENGE_DETAILS_PATH,
  ON_LIFE_CHALLENGE_ID_PARAM_NAME,
  ON_LIFE_ELIGIBLE_GROUPS,
  ON_LIFE_PHA,
  SSO_GROUP_ID,
  SSO_MEMBER_ID,
  SSO_SUBJECT,
  SSO_TARGET_RESOURCE,
} from '../ssoConstants';

export default async function generateOnLifeMap(
  memberData: LoggedInMember,
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  console.log('generateOnLifeMap entered !!!');
  const ssoParamMap = new Map<string, string>();

  if (memberData == null || memberData == undefined) {
    throw new Error('Member not found');
  }

  //Need to get from Request Param
  const reqTarget = searchParams?.target ?? '';
  const challengeIdValue = searchParams?.challengeIdValue ?? '';
  const subscriberSuffix = getSubscriberSuffix(
    memberData.subscriberId,
    memberData.suffix,
  );
  const target = getOnLifeTarget(memberData, reqTarget, challengeIdValue);
  ssoParamMap.set(SSO_TARGET_RESOURCE, target);
  ssoParamMap.set(SSO_MEMBER_ID, subscriberSuffix);
  ssoParamMap.set(SSO_GROUP_ID, memberData.groupId);
  ssoParamMap.set(SSO_SUBJECT, memberData.userId);
  console.log('generateOnLifeMap exited !!!');
  return ssoParamMap;
}

const getOnLifeTarget = (
  memberData: LoggedInMember,
  reqTarget: string,
  challengeIdValue: string,
): string => {
  //Need to get from REquest Param
  let target: string = '';
  const challengeDeeplinkGroupFlag: boolean =
    ON_LIFE_ELIGIBLE_GROUPS === memberData.groupId;

  if (challengeDeeplinkGroupFlag) {
    target = process.env.ON_LIFE_CHALLENGE_VALUE ?? '';
    target +=
      ON_LIFE_CHALLENGE_DETAILS_PATH +
      '?' +
      ON_LIFE_CHALLENGE_ID_PARAM_NAME +
      '=' +
      challengeIdValue;
  } else {
    target = getTargetResourceValue(reqTarget);
  }
  return target;
};

const getTargetResourceValue = (target: string): string => {
  if (target === ON_LIFE_CHALLENGE)
    return process.env.ON_LIFE_CHALLENGE_VALUE ?? '';
  if (target === ON_LIFE_PHA) return process.env.ON_LIFE_PHA_VALUE ?? '';
  return process.env.ON_LIFE_DEFAULT ?? '';
};
