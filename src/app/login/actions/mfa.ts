'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { decrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { setWebsphereRedirectCookie } from '@/utils/wps_redirect';
import { AxiosError } from 'axios';
import { LoginResponse } from '../models/api/login';
import { SelectMfaDeviceResponse } from '../models/api/select_mfa_device_response';
import { slideErrorCodes } from '../models/app/error_code_message_map';
import { SelectMFAStatus, SubmitMFAStatus } from '../models/status';

type SelectMfaArgs = {
  deviceId: string;
  interactionId: string;
  interactionToken: string;
  policyId?: string;
  appId?: string;
};

type SubmitMfaOtpArgs = {
  otp: string;
  interactionId: string;
  interactionToken: string;
  userToken: string;
  policyId?: string;
  appId?: string;
};

export async function callSelectDevice(
  args: SelectMfaArgs,
): Promise<ActionResponse<SelectMFAStatus, SelectMfaDeviceResponse>> {
  try {
    logger.info('Selected Mfa Device');
    args.policyId = process.env.ES_API_POLICY_ID;
    args.appId = process.env.ES_API_APP_ID;
    const resp = await esApi.post<ESResponse<SelectMfaDeviceResponse>>(
      '/mfAuthentication/loginAuthentication/selectDevice',
      args,
    );
    logger.info('Select Device API - Success', resp);
    return {
      status: SelectMFAStatus.OK,
      data: resp.data?.data,
    };
  } catch (err) {
    logger.error('Select Device API - Failure', err);
    if (err instanceof AxiosError) {
      return {
        status: SelectMFAStatus.ERROR,
        error: {
          errorCode: err.response?.data?.data?.errorCode,
        },
      };
    } else {
      throw 'An error occured';
    }
  }
}

export async function callSubmitMfaOtp(
  params: SubmitMfaOtpArgs,
): Promise<ActionResponse<SubmitMFAStatus, LoginResponse>> {
  let authUser: string | null = null;
  try {
    let status: SubmitMFAStatus = SubmitMFAStatus.OTP_OK;
    params.policyId = process.env.ES_API_POLICY_ID;
    params.appId = process.env.ES_API_APP_ID;
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication/provideOtp',
      params,
    );
    logger.info('Submit MFA OTP API - Success', resp);
    const username = verifyUserId(params.userToken);
    if (!username) {
      throw 'Failed to verify username';
    }
    if (resp.data.data?.flowStatus == 'PASSWORD_RESET_REQUIRED') {
      status = SubmitMFAStatus.PASSWORD_RESET_REQUIRED;
    } else {
      authUser = username;
    }
    await setWebsphereRedirectCookie({
      ...resp.data.data,
    });
    return {
      status: status,
      data: resp.data.data,
    };
  } catch (err) {
    logger.error('Submit MFA OTP API - Failure', err);
    if (err instanceof AxiosError) {
      if (slideErrorCodes.includes(err.response?.data.data.errorCode)) {
        if (err.response?.data.data.errorCode == 'MF-405') {
          return {
            status: SubmitMFAStatus.OTP_INVALID_LIMIT_REACHED,
            error: {
              errorCode: err.response?.data.data.errorCode,
            },
          };
        } else {
          return {
            status: SubmitMFAStatus.GENERIC_OR_INLINE_ERROR,
            error: {
              errorCode: err.response?.data.data.errorCode,
            },
          };
        }
      } else {
        return {
          status: SubmitMFAStatus.GENERIC_OR_INLINE_ERROR,
          error: {
            errorCode: err.response?.data.data.errorCode,
          },
        };
      }
    } else {
      throw 'An error occurred';
    }
  } finally {
    if (authUser) {
      await signIn('credentials', {
        userId: authUser,
        redirect: false,
      });
    }
  }
}

function verifyUserId(token: string): string | null {
  try {
    const json = decrypt(token);
    const userData: DXAuthToken = JSON.parse(json);
    logger.info(`Verified MFA user token: ${userData.user}`);
    return userData.user;
  } catch (err) {
    logger.error('Failed to verify username in MFA flow!', err);
    return null;
  }
}
