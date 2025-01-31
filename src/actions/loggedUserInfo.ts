'use server';

import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { memberService } from '@/utils/api/memberService';

export type MemberData = {
  id: string;
  name: string;
  memberCK: number;
  firstName?: string;
  lastName?: string;
  suffix: number;
  dob: string;
};

export async function getLoggedInUserInfo(
  memberCk: string,
): Promise<LoggedInUserInfo> {
  try {
    const resp = await memberService.get<LoggedInUserInfo>(
      `/api/member/v1/members/byMemberCk/${memberCk}`,
    );

    return resp.data;
  } catch (err: any) {
    console.error('LoggedInUserInfo API error');
    //TODO: Remove returning the mock response and throw error instead
    // once we have enough test data.
    if (err?.response?.data?.desc == 'Mocked Error') {
      throw err;
    }
    return loggedInUserInfoMockResp;
  }
}
