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
import { SelectMFAStatus, SubmitMFAStatus } from '../models/status';

type SelectMfaArgs = {
  deviceId: string;
  interactionId: string;
  interactionToken: string;
};

type SubmitMfaOtpArgs = {
  otp: string;
  interactionId: string;
  interactionToken: string;
  userToken: string;
};

export async function callSelectDevice(
  args: SelectMfaArgs,
): Promise<ActionResponse<SelectMFAStatus, SelectMfaDeviceResponse>> {
  try {
    logger.info('Selected Mfa Device');
    console.log(args);
    const resp = await esApi.post<ESResponse<SelectMfaDeviceResponse>>(
      '/mfAuthentication/loginAuthentication/selectDevice',
      args,
    );
    logger.info('Successful Select Device Api response');
    console.log(resp.data);
    return {
      status: SelectMFAStatus.OK,
      data: resp.data?.data,
    };
  } catch (err) {
    logger.error('Error from SelectDevice Api');
    if (err instanceof AxiosError) {
      console.error(err.response?.data);
      return {
        status: SelectMFAStatus.ERROR,
        error: {
          errorCode: err.response?.data.data.errorCode,
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
  console.debug(params);
  try {
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication/provideOtp',
      params,
    );

    logger.info('Successful Submit Api response');
    console.log(resp.data);
    const username = verifyUserId(params.userToken);
    if (!username) {
      throw 'Failed to verify username';
    }
    authUser = username;
    await setWebsphereRedirectCookie({
      ...resp.data.data,
    });
    return {
      status: SubmitMFAStatus.OTP_OK,
      data: resp.data.data,
    };
  } catch (err) {
    logger.error('Error from Submit Otp Api');
    if (err instanceof AxiosError) {
      console.error('Error in submitMfaOtp');
      console.error(err.response?.data);
      return {
        status: SubmitMFAStatus.ERROR,
        error: {
          errorCode: err.response?.data.data.errorCode,
        },
      };
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
    console.debug(`Verified MFA user token: ${userData.user}`);
    return userData.user;
  } catch (err) {
    console.error('Failed to verify username in MFA flow!');
    console.error(err);
    return null;
  }
}
