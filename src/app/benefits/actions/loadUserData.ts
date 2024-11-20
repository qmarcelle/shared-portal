import { auth } from '@/auth';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';

export const loadUserData = async (): Promise<
  ActionResponse<number, LoggedInUserInfo>
> => {
  const session: Session | null = await auth();
  const memberCk = session?.user.currUsr?.plan.memCk
    ? session?.user.currUsr?.plan.memCk
    : '0';
  logger.info(`Getting LoggedInUserInfo for memberCk: ${memberCk}`);
  //get LoggedInUserData based on MemberCk
  const loggedInUserInfo = loggedInUserInfoMockResp;
  return { status: 200, data: loggedInUserInfo };
};
