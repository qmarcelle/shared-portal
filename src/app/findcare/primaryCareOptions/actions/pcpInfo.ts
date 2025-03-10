'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { pcpService } from '@/utils/api/pcpService';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';
import { PrimaryCareProviderDetails } from '../model/api/primary_care_provider';
import { UpdatePCPPhysicianRequest } from '../model/app/updatePCPPhysicianRequest';
import { updatePCPPhysicianResponse } from '../model/app/updatePCPPhysicianResponse';

export async function getPCPInfo(
  session?: Session | null,
): Promise<PrimaryCareProviderDetails> {
  try {
    const memberDetails = session ?? (await auth());
    const response = await pcpService.get(
      `/pcPhysician/${memberDetails?.user.currUsr?.plan!.memCk}`,
    );
    logger.info('Get PCP Physician Data', response?.data);
    return response?.data;
  } catch (error) {
    logger.error('Error Response from GetPCPInfo API', error);
    throw error;
  }
}

export async function updatePCPhysician(
  request: UpdatePCPPhysicianRequest,
): Promise<ActionResponse<number, updatePCPPhysicianResponse>> {
  try {
    const session = await auth();
    const loggedInUserInfo = await getLoggedInUserInfo(
      `${session?.user.currUsr?.plan!.memCk}`,
    );
    request.memberCK = session?.user.currUsr?.plan!.memCk ?? '';
    request.subscriberID = loggedInUserInfo.subscriberID;
    request.subscriberName =
      loggedInUserInfo.subscriberFirstName +
      ' ' +
      loggedInUserInfo.subscriberLastName;
    if (session?.user) {
      request.contactRelation = 'Self';
    } else {
      request.contactRelation = 'Dependent';
    }

    const apiResponse = await pcpService.post(
      `/pcPhysician/${session?.user.currUsr?.plan!.memCk}`,
      request,
    );
    return { status: 200, data: { message: apiResponse?.data?.message } };
  } catch (error) {
    return {
      status: 400,
      data: {
        message: 'Update PCPInfo Failed :' + error,
      },
    };
  }
}
