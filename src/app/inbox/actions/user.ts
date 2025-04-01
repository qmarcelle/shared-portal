import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { memberService } from '@/utils/api/memberService';

//TODO: Delete this file and use the global implementation once PR 3037: Session Caching with PZN Model and Storage Implementation, is merged
export async function getLoggedInUserInfo(
  userId: string,
): Promise<ActionResponse<number, LoggedInUserInfo>> {
  try {
    const resp = await memberService.get<LoggedInUserInfo>(
      `/api/member/v1/loggedInUserInfo/${userId.toLowerCase()}`,
    );

    return {
      status: 200,
      data: resp.data,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      data: loggedInUserInfoMockResp,
    };
  }
}
