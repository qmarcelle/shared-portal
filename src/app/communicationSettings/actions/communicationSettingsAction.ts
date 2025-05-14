'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import {
  CommunicationSettingsAppData,
  CommunicationSettingsSaveRequest,
  CommunicationSettingsSaveResponse,
} from '../models/app/communicationSettingsAppData';

export async function getCommunicationSettingsAppData(): Promise<CommunicationSettingsAppData> {
  try {
    const session = await auth();
    const response = await esApi.get(
      `/memberContactPreference?memberKey=${session?.user.currUsr.plan!.memCk}&subscriberKey=${session?.user.currUsr?.plan!.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey&extendedOptions=true`,
    );
    logger.info('contactPrefRes', response?.data?.data);
    return response?.data?.data;
  } catch (error) {
    logger.error('Error Response from  Email API', error);
    throw error;
  }
}

export async function saveDataAction(
  request: CommunicationSettingsSaveRequest,
): Promise<ESResponse<CommunicationSettingsSaveResponse>> {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember();
    const saveDataRequest: CommunicationSettingsSaveRequest = {
      emailAddress: request.emailAddress,
      mobileNumber: request.mobileNumber,
      memberKey: session?.user.currUsr?.plan!.memCk,
      subscriberKey: session?.user.currUsr?.plan!.sbsbCk,
      contactPreference: request.contactPreference,
      groupKey: memberDetails.groupKey,
      lineOfBusiness: memberDetails.lineOfBusiness,
    };

  const resp = await esApi.post<
      ESResponse<CommunicationSettingsSaveResponse>
    >('/memberContactPreference', saveDataRequest);
    logger.info(
      'Contact Pref - Save Action Response ',
      JSON.stringify(resp.data),
    );

    return resp.data;
  } catch (error) {
    console.debug(error);
    logger.error('Save Data  - Failure' + error);
    throw error;
  }
}
