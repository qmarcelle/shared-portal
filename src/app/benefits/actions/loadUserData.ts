import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';

export const loadUserData = async (): Promise<
  ActionResponse<number, LoggedInUserInfo>
> => {
  try {
    const session: Session | null = await auth();
    const memberCk = session?.user.currUsr?.plan.memCk
      ? session?.user.currUsr?.plan.memCk
      : '0';
    logger.info(`Plan Info: ${JSON.stringify(session?.user.currUsr?.plan)}`);
    logger.info(`Getting LoggedInUserInfo for memberCk: ${memberCk}`);
    //get LoggedInUserData based on MemberCk
    const dataURL = `/api/member/v1/members/byMemberCk/${memberCk}`;
    const eligibilityForMember =
      await memberService.get<LoggedInUserInfo>(dataURL);
    if (eligibilityForMember.status !== 200) {
      logger.info(`Error fetching eligibility data for memberCk: ${memberCk}`);
      throw new Error('Error fetching eligibility data');
    }
    return { status: 200, data: eligibilityForMember.data };
  } catch (error) {
    logger.error(`Error fetching eligibility data: ${error}`);
    return { status: 400, data: undefined };
  }
};
