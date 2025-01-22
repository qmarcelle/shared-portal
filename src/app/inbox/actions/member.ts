import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { getLoggedInUserInfo } from './user';

export async function getMemberInfo(
  id: string,
): Promise<ActionResponse<number, LoggedInUserInfo>> {
  try {
    const loggedInMemberInfo = await getLoggedInUserInfo(id);

    return {
      status: 300,
      data: loggedInMemberInfo.data! as LoggedInUserInfo,
    };
  } catch (err) {
    return {
      status: 400,
    };
  }
}
