'use server';

import { signIn } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
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
  try {
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication/provideOtp',
      params,
    );

    logger.info('Successful Submit Api response');
    console.log(resp.data);
    authUser = 'akash11!'; //TODO Retrieve auth username from a service or server-side storage i.e. Mongo
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
      });
    }
  }
}
