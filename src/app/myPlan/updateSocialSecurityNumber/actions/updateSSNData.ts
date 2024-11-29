'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { UpdateSSNRequest } from '../models/app/updateSSNRequest';
import { UpdateSSNResponse } from '../models/app/updateSSNResponse';

export async function updateSSNData(
  request: UpdateSSNRequest,
): Promise<ActionResponse<number, UpdateSSNResponse>> {
  try {
    const session = await auth();
    const apiResponse = await portalSvcsApi.post(
      `/memberservice/api/member/v1/members/byMemberCk/${session?.user.currUsr?.plan.memCk}/updateSSN`,
      request,
    );
    return { status: 200, data: { message: apiResponse?.data?.message } };
  } catch (error) {
    console.debug(error);
    logger.error('Update SSN Failed' + error);
    throw error;
  }
}
