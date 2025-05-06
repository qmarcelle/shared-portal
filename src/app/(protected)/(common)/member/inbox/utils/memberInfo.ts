import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { IMemberInfo } from '../models/api/document';

export async function getMembersInfoList(): Promise<
  ActionResponse<number, IMemberInfo[]>
> {
  try {
    const session = await auth();
    const loggedInMemberInfoReq = await getLoggedInUserInfo(
      session!.user.currUsr!.plan!.memCk,
    );

    const loggedInUserInfo: LoggedInUserInfo = loggedInMemberInfoReq;

    const list: IMemberInfo[] = loggedInUserInfo.members.map(
      (member: Member) => {
        return {
          name: `${member.firstName} ${member.lastName}`,
          id: `${loggedInUserInfo.subscriberID}0${member.memberSuffix}`,
        };
      },
    );

    return {
      status: 200,
      data: list,
    };
  } catch (err) {
    logger.error('Get Members Info List Action Failed', err);
    return {
      status: 400,
    };
  }
}
