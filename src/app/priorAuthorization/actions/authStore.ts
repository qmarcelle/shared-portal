'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { response } from '../mock/priorAuthMockData';
import { MemberPriorAuthDetail } from '../models/priorAuthData';

export async function invokeSortData(): Promise<
  ESResponse<MemberPriorAuthDetail[]>
> {
  try {
    // const resp = await esApi.get<AuthResponse<MemberPriorAuthDetail>>(
    //   '/memberPriorAuthDetailsAPI/memberPriorAuthDetails?memberKey=memKey1&fromDate=12/31/2000&toDate=12/31/2000&reviewType=R',
    // );
    const resp = await response;
    return resp;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response from API ' + error.response?.data);
      logger.error('Error in Login');
      console.error(error.response?.data);
      return { errorCode: error.response?.data?.data?.errorCode };
    } else {
      throw error;
    }
  }
}
