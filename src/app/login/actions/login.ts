'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { LoginRequest, LoginResponse } from '../models/api/login';
import { LoginStatus } from '../models/status';

const INVALID_CREDENTIALS_ES_ERROR_CODE = 'UI-401';

export async function callLogin(
  request: LoginRequest,
): Promise<ActionResponse<LoginStatus, LoginResponse>> {
  try {
    if (!request.username || !request.password) {
      return {
        status: LoginStatus.VALIDATION_FAILURE,
      };
    }
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication',
      request,
    );

    console.debug(resp);

    if (resp.data.data?.mfaDeviceList.length == 0) {
      await signIn('credentials', {
        userId: request.username,
      });
      return {
        status: LoginStatus.LOGIN_OK,
        data: resp.data.data,
      };
    } else {
      return {
        status: LoginStatus.MFA_REQUIRED,
        data: resp.data.data,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      //logger.error("Response from API " + error.response?.data);
      logger.error('Error in Login');
      console.error(error.response?.data);
      return {
        status:
          error.response?.data.data.errorCode ==
          INVALID_CREDENTIALS_ES_ERROR_CODE
            ? LoginStatus.INVALID_CREDENTIALS
            : LoginStatus.ERROR,
        data: error.response?.data.data,
        error: {
          errorCode: error.response?.data.data.errorCode,
          message: error.response?.data,
        },
      };
    } else {
      throw error;
    }
  }
}
