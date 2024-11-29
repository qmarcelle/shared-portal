'use server';

import { memberMockResponse } from '@/mock/memberMockResponse';
import { MemberData, getLoggedInUserInfo } from './loggedUserInfo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMemberDetails(): Promise<any> {
  //need to implement member service API call
  return memberMockResponse;
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
