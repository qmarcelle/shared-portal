'use server';

import { auth } from '@/auth';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { Session } from 'next-auth';
import { MemberData, getLoggedInUserInfo } from './loggedUserInfo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMemberDetails(): Promise<any> {
  //need to implement member service API call
  return memberMockResponse;
}

export async function getLoggedInMember(
  sessionData?: Session | null,
): Promise<LoggedInMember> {
  try {
    const member: LoggedInMember = {} as LoggedInMember;
    const session = sessionData ?? (await auth());
    const loggedUserInfo = await getLoggedInUserInfo(
      session?.user.currUsr?.plan.memCk ?? '',
    );
    member.subscriberId = loggedUserInfo.subscriberID;
    const loggedMember = loggedUserInfo.members.find(
      (x) => x.memRelation == 'M',
    );
    if (loggedMember) {
      member.suffix = loggedMember?.memberSuffix ?? 0;
    }
    return member;
  } catch (error) {
    console.error('LoggedInUserInfo API error', error);
    throw error;
  }
}

export async function getMemberAndDependents(
  memberCk: string,
): Promise<MemberData[]> {
  const loggedInUser = await getLoggedInUserInfo(memberCk);
  return loggedInUser.members.map((item) => {
    const name = `${item.firstName} ${item.lastName}`;
    return {
      id: name + item.memberCk.toString().slice(-2),
      name,
      memberCK: item.memberCk,
    };
  });
}
