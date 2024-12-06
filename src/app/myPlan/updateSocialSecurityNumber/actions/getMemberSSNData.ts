'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import { MemberList } from '../models/app/memberList';

export async function getMemberSSNData(): Promise<
  ActionResponse<number, MemberList>
> {
  try {
    const session = await auth();
    const resp = await getLoggedInUserInfo(
      session?.user.currUsr?.plan.memCk ?? '',
    );
    return {
      status: 200,
      data: {
        members: resp.members?.map((item) => ({
          memberCk: item.memberCk,
          firstName: item.firstName,
          lastName: item.lastName,
          hasSocial: item.hasSocial,
          birthDate: item.birthDate,
        })),
      },
    };
  } catch (error) {
    console.error(error);
    logger.error('Get MemberData Failed : ', error);
    return {
      status: 400,
    };
  }
}
