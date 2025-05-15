'use server';

import { getContactInfo } from '@/app/myPlan/actions/getAllPlansData';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { InviteRegisterEmailResponse } from '../models/representativeDetails';

export async function requestFullAccessToMembers(
  memeCk: string,
  requesteeFHRID: string,
  requesteeUMPID: string,
): Promise<InviteRegisterEmailResponse> {
  try {
    const contactInfo = await getContactInfo(requesteeUMPID);
    const response = await esApi.get<ESResponse<InviteRegisterEmailResponse>>(
      `/userRegistration/sharePermission/sendInvite?memeck=${memeCk}&requesteeFHRID=${requesteeFHRID}&requesteeEmailID=${contactInfo.email}&requestType=Access`,
    );

    return response.data.data!;
  } catch (error) {
    logger.error('Error Response from  requestFullAccessToMembers', error);
    throw error;
  }
}
