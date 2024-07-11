'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { LoginResponse } from '../models/api/login';
import { SelectMfaDeviceResponse } from '../models/api/select_mfa_device_response';

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

export enum SelectMFAStatus {
  OK,
  VALIDATION_FAILURE,
  ERROR,
}

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
    return resp.data;
  } catch (err) {
    logger.error('Error from SelectDevice Api');
    if (err instanceof AxiosError) {
      console.error(err.response?.data);
      return { errorCode: err.response?.data.data.errorCode };
    } else {
      throw 'An error occured';
    }
  }
}

export enum SubmitMFAStatus {
  OTP_OK,
  OTP_INVALID,
  VALIDATION_FAILURE,
  ERROR,
}

export async function callSubmitMfaOtp(
  params: SubmitMfaOtpArgs,
): Promise<ESResponse<LoginResponse>> {
  try {
    const resp = await esApi.post<ESResponse<LoginResponse>>(
      '/mfAuthentication/loginAuthentication/provideOtp',
      params,
    );

    logger.info('Successful Submit Api response');
    console.log(resp.data);
    return resp.data;
  } catch (err) {
    logger.error('Error from Submit Otp Api');
    if (err instanceof AxiosError) {
      console.error('Error in submitMfaOtp');
      console.error(err.response?.data);
      return { errorCode: err.response?.data.data.errorCode };
    } else {
      throw 'An error occurred';
    }
  }
}
