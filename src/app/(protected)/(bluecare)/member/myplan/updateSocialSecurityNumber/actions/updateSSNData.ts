'use server';

import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { UpdateSSNRequest } from '../models/app/updateSSNRequest';
import { UpdateSSNResponse } from '../models/app/updateSSNResponse';

export async function updateSSNData(
  request: UpdateSSNRequest,
): Promise<ActionResponse<number, UpdateSSNResponse>> {
  try {
    const session = await auth();
    const apiResponse = await memberService.post(
      `/api/member/v1/members/byMemberCk/${session?.user.currUsr?.plan!.memCk}/updateSSN`,
      request,
    );
    return { status: 200, data: { message: apiResponse?.data?.message } };
  } catch (error) {
    console.debug(error);
    logger.error('Update SSN Failed' + error);
    throw error;
  }
}
