'use server';

import { updatePCPPhysicianResponse } from '@/app/findcare/primaryCareOptions/model/app/updatePCPPhysicianResponse';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { format } from 'date-fns';
import { Session } from 'next-auth';
import { NCQAAllPossibleAnswers } from '../model/api/ncqaAllPossibleAnswersData';
import { NCQASelectedAnswers } from '../model/api/ncqaSelectedData';
import { UpdateHealthEquityPreferenceRequest } from '../model/api/updateHealthEquityPreferenceRequest';

export async function getHealthEquityPossibleAnswers(): Promise<NCQAAllPossibleAnswers> {
  try {
    const resp = await esApi.get<ESResponse<NCQAAllPossibleAnswers>>(
      '/memberInfo/healthEquityPossibleAnswers',
    );
    return resp.data.data!;
  } catch (error) {
    logger.error(
      'Error Response from getHealthEquityPossibleAnswers API',
      error,
    );
    throw error;
  }
}

export async function getHealthEquitySelectedAnswers(
  sessionDetails?: Session | null,
): Promise<NCQASelectedAnswers> {
  try {
    const resp = await esApi.get<ESResponse<NCQASelectedAnswers>>(
      `/memberInfo/healthEquityPreference?memberKey=${sessionDetails?.user.currUsr?.plan!.memCk}&subscriberKey=${sessionDetails?.user.currUsr?.plan!.sbsbCk}&getMemberPreferenceBy=memberKeySubscriberKey`,
    );
    return resp.data.data!;
  } catch (error) {
    logger.error(
      'Error Response from getHealthEquitySelectedAnswers API',
      error,
    );
    throw error;
  }
}

export async function updateHealthEquityPreference(
  request: Partial<UpdateHealthEquityPreferenceRequest>,
): Promise<ActionResponse<number, updatePCPPhysicianResponse>> {
  try {
    const session = await auth();
    request.memberContrivedKey = String(session?.user.currUsr?.plan!.memCk);
    request.subscriberContrivedKey = String(
      session?.user.currUsr?.plan!.sbsbCk,
    );
    request.groupContrivedKey = String(session?.user.currUsr?.plan!.grgrCk);
    request.userId = String(session?.user.id);
    request.memberPreferenceBy = 'memberKeySubscriberKey';
    request.dataSource = '11';
    request.lastUpdateDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    request.srcLoadDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const apiResponse = await esApi.post(
      'memberInfo/healthEquityPreference',
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
