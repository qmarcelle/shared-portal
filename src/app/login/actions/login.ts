'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { LoginRequest, LoginResponse } from '../models/api/login';

export async function callLogin(
  request: LoginRequest,
): Promise<ESResponse<LoginResponse>> {
  try {
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication',
      request,
    );
    logger.info('Successful Login Api response');
    console.log(resp.data);
    return resp.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      //logger.error("Response from API " + error.response?.data);
      logger.error('Error in Login');
      console.error(error.response?.data);
      return { errorCode: error.response?.data.data.errorCode };
    } else {
      throw error;
    }
  }
}
