'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  PortalLoginResponse,
} from '../models/api/login';
import { LoginStatus } from '../models/status';

const INVALID_CREDENTIALS_ES_ERROR_CODE = 'UI-401';

export async function callLogin(
  request: LoginRequest,
): Promise<ActionResponse<LoginStatus, PortalLoginResponse>> {
  let authUser: string | null = null;
  let status: LoginStatus;
  try {
    if (!request.username || !request.password) {
      return {
        status: LoginStatus.VALIDATION_FAILURE,
      };
    }
    request.policyId = process.env.ES_API_POLICY_ID;
    request.appId = process.env.ES_API_APP_ID;
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication',
      request,
    );

    console.debug(resp);
    status = LoginStatus.ERROR;

    switch (resp.data.data?.message) {
      case 'MFA_Disabled':
      case 'COMPLETED':
        authUser = request.username;
        status = LoginStatus.LOGIN_OK;
        break;
      case 'EMAIL_VERIFICATION_REQUIRED':
      case 'NO_DEVICES_EMAIL_VERIFICATION_REQUIRED':
        authUser = request.username; //TODO REMOVE THIS when email verification UI is implemented!!
        status = LoginStatus.VERIFY_EMAIL;
        break;
      case 'OTP_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_ONE_DEVICE;
        break;
      case 'DEVICE_SELECTION_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_MULTIPLE_DEVICES;
        break;
    }
    if (!resp.data.data) throw 'Invalid API response'; //Unlikely to ever occur but needs to be here to appease TypeScript on the following line
    return {
      status,
      data: {
        ...resp.data.data,
        userToken: encrypt(
          JSON.stringify({
            user: request.username,
            time: UNIXTimeSeconds(),
          }),
        ),
      },
    };
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
        redirect: false,
      });
    }
  }
}
