'use server';

import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { getAuthToken } from '@/utils/api/getToken';
import { logger } from '@/utils/logger';

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
  refresh = false,
  userId?: string,
): Promise<LoggedInUserInfo> {
  try {
    logger.info('Calling LoggedIn User Info API');
    const resp = await fetch(
      `${process.env.PORTAL_SERVICES_URL}${process.env.MEMBERSERVICE_CONTEXT_ROOT}/api/member/v1/members/byMemberCk/${memberCk}`,
      {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        cache: refresh ? 'no-store' : undefined,
        next: {
          revalidate: !refresh ? 1800 : undefined,
          tags: [memberCk, ...(userId ? [userId] : [])],
        },
      },
    );

    const result = (await resp.json()) as LoggedInUserInfo;

    return result;
  } catch (err: any) {
    console.error('LoggedInUserInfo API error', err);
    //TODO: Remove returning the mock response and throw error instead
    // once we have enough test data.
    if (err?.response?.data?.desc == 'Mocked Error') {
      throw err;
    }
    throw err;
    //return loggedInUserInfoMockResp;
  }
}
