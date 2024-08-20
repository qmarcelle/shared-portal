'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { PortalLoginResponse } from '../models/api/login';
import { VerifyEmailOtpRequest } from '../models/api/verify_email_otp_request';
import { LoginStatus } from '../models/status';

export async function callVerifyEmailOtp(
  request: VerifyEmailOtpRequest,
): Promise<ActionResponse<LoginStatus, PortalLoginResponse>> {
  let authUser: string | null = null;
  let status: LoginStatus;
  try {
    request.policyId = process.env.ES_API_POLICY_ID;
    request.appId = process.env.ES_API_APP_ID;
    console.log(request);
    const resp = await esApi.post<ESResponse<PortalLoginResponse>>(
      '/mfAuthentication/loginAuthentication/verifyEmailOtp',
      request,
    );

    console.debug(resp.data);
    status = LoginStatus.ERROR;

    switch (resp.data.data?.message) {
      case 'MFA_Disabled':
      case 'COMPLETED':
        authUser = request.username;
        status = LoginStatus.LOGIN_OK;
        break;
      case 'OTP_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_ONE_DEVICE;
        break;
      case 'DEVICE_SELECTION_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_MULTIPLE_DEVICES;
        break;
      case 'ACCOUNT_INACTIVE':
        status = LoginStatus.ACCOUNT_INACTIVE;
        throw 'Multiple login attempts';
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
    if (error == 'Multiple login attempts') {
      return { status: LoginStatus.ACCOUNT_INACTIVE };
    }
    if (error instanceof AxiosError) {
      //logger.error("Response from API " + error.response?.data);
      logger.error('Error in Login');
      console.error(error.response?.data);
      return {
        status: LoginStatus.ERROR,
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
