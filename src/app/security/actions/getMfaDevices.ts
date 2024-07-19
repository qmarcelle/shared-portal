'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { GetMfaDevices } from '../models/get_mfa_devices';

export async function getMfaDevices(
  userId: string,
): Promise<ESResponse<GetMfaDevices>> {
  try {
    const request = {
      userId,
    };
    const axiosResponse = await esApi.post(
      '/mfAuthentication/getDevices',
      request,
    );
    console.log(
      `GetMFADevices Success Response - ${JSON.stringify(axiosResponse.data)}`,
    );
    return axiosResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response from API ' + error.response?.data);
      console.log(
        `GetMFADevices Failed With Error Code - ${error.response?.data?.data?.errorCode}, Error Response - ${JSON.stringify(error.response?.data)}`,
      );
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode,
      };
    } else {
      console.log(`GetMFADevices Failed With Error - ${JSON.stringify(error)}`);
      throw 'An error occured';
    }
  }
}
