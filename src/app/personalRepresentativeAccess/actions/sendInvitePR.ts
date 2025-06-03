'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { InviteRegisterEmailResponse } from '../models/representativeDetails';

export async function invokeSendEmailInvite(
  memeCk: string,
  requesteeFHRID: string,
  requesteeEmailID: string,
): Promise<InviteRegisterEmailResponse> {
  try {
    const resp = await esApi.get<ESResponse<InviteRegisterEmailResponse>>(
      `/userRegistration/sharePermission/sendInvite?memeck=${memeCk}&requesteeFHRID=${requesteeFHRID}&requesteeEmailID=${requesteeEmailID}&requestType=Invite`,
    );
    return resp.data.data!;
  } catch (error) {
    logger.error('Error Response from sendingInvitetoMembers', error);
    throw error;
  }
}
