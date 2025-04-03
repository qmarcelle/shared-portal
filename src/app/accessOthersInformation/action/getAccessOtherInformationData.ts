'use server';

import { getContactInfo } from '@/app/myPlan/actions/getAllPlansData';
import { auth } from '@/auth';
import { ShareMyPlanDetails } from '@/models/app/getSharePlanDetails';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AccesssInfomationEmailResponse } from '../models/accessInformationEmailResponse';

export async function requestAccessToMembers(
  memberDetails: ShareMyPlanDetails,
): Promise<AccesssInfomationEmailResponse> {
  try {
    const session = await auth();
    const contactInfo = await getContactInfo(memberDetails.requesteeUMPID);
    const response = await esApi.get<
      ESResponse<AccesssInfomationEmailResponse>
    >(
      `/userRegistration/sharePermission/sendInvite?memeck=${session?.user.currUsr.plan!.memCk}&requesteeFHRID=${memberDetails.requesteeFHRID}&requesteeEmailID=${contactInfo.email}&requestType=Access`,
    );

    return response.data.data!;
  } catch (error) {
    logger.error('Error Response from  requestAccessToMembers', error);
    throw error;
  }
}
