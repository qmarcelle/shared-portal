'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { clearGenesysCookies, setSTAndInteractionDataCookies } from '@/utils/ping_cookies';
import { AxiosError } from 'axios';
import { PortalLoginResponse } from '../models/api/login';
import { VerifyEmailOtpRequest } from '../models/api/verify_email_otp_request';
import { LoginStatus } from '../models/status';

export async function callVerifyEmailOtp(
  request: VerifyEmailOtpRequest,
  verifyEmailEndPoint: string,
): Promise<ActionResponse<LoginStatus, PortalLoginResponse>> {
  let authUser: string | null = null;
  let status: LoginStatus;
  try {
    request.policyId = process.env.ES_API_POLICY_ID;
    request.appId = process.env.ES_API_APP_ID;

    const resp = await esApi.post<ESResponse<PortalLoginResponse>>(
      `/mfAuthentication/loginAuthentication/${verifyEmailEndPoint}`,
      request,
    );

    logger.info('Verify Email OTP API- Success', resp, request.username);
    status = LoginStatus.ERROR;

    switch (resp.data.data?.message) {
      case 'MFA_Disabled':
      case 'COMPLETED':
        authUser = request.username;
        await clearGenesysCookies();
        await setSTAndInteractionDataCookies({
          ...resp.data.data,
        });
        status = LoginStatus.LOGIN_OK;
        break;
      case 'OTP_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_ONE_DEVICE;
        break;
      case 'DEVICE_SELECTION_REQUIRED':
        status = LoginStatus.MFA_REQUIRED_MULTIPLE_DEVICES;
        break;
      case 'PASSWORD_RESET_REQUIRED':
        status = LoginStatus.PASSWORD_RESET_REQUIRED;
        break;
      case 'Duplicate_Account':
        status = LoginStatus.DUPLICATE_ACCOUNT;
        break;
      case 'NEW_EMAIL_REQUIRED':
        status = LoginStatus.EMAIL_UNIQUENESS;
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
    logger.error('Verify Email OTP API - Failure', error, request.username);
    if (error instanceof AxiosError) {
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
        impersonator: null,
        redirect: false,
      });
    }
  }
}
