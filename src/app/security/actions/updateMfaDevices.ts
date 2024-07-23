'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import {
  UpdateMfaRequest,
  UpdateMfaResponse,
} from '../models/update_mfa_devices';

export async function updateMfaDevices(
  request: UpdateMfaRequest,
): Promise<ESResponse<UpdateMfaResponse>> {
  try {
    const axiosResponse = await esApi.post(
      '/mfAuthentication/updateDevices',
      request,
    );
    console.log(
      `UpdateMFADevices Success Response - ${JSON.stringify(axiosResponse.data)}`,
    );
    return axiosResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response from API ' + error.response?.data);
      console.log(
        `UpdateMFADevices Failed With Error Code - ${error.response?.data?.data?.errorCode}, Error Response - ${JSON.stringify(error.response?.data)}`,
      );
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode,
      };
    } else {
      console.log(
        `UpdateMfaDevice Failed with Error - ${JSON.stringify(error)}`,
      );
      throw 'An error occured';
    }
  }
}
