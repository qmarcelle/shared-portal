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
  let authUser: string | null = null;
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

    switch (resp.data.data?.message) {
      case 'COMPLETED':
        authUser = request.username;
        return {
          status: LoginStatus.LOGIN_OK,
          data: resp.data.data,
        };
      case 'EMAIL_VERIFICATION_REQUIRED':
      case 'NO_DEVICES_EMAIL_VERIFICATION_REQUIRED':
        authUser = request.username; //TODO REMOVE THIS when email verification UI is implemented!!
        return {
          status: LoginStatus.VERIFY_EMAIL,
          data: resp.data.data,
        };
      case 'OTP_REQUIRED':
        return {
          status: LoginStatus.MFA_REQUIRED,
          data: resp.data.data,
        };
      default:
        return {
          status: LoginStatus.ERROR,
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
  } finally {
    if (authUser) {
      //signIn calls redirect() so it must be done in the finally block.
      await signIn('credentials', {
        userId: authUser,
      });
    }
  }
}
