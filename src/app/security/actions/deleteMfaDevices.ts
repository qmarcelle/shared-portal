'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { DeleteMfaResponse } from '../models/delete_mfa_devices';
import { UpdateMfaRequest } from '../models/update_mfa_devices';

export async function deleteMfaDevices(
  request: UpdateMfaRequest,
): Promise<ESResponse<DeleteMfaResponse>> {
  try {
    const axiosResponse = await esApi.post(
      '/mfAuthentication/deleteDevices',
      request,
    );
    console.log(
      `DeleteMFADevices Success Response - ${JSON.stringify(axiosResponse.data)}`,
    );
    return axiosResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response from API ' + error.response?.data);
      console.log(
        `DeleteMFADevices Failed With Error Code - ${error.response?.data?.data?.errorCode}, Error Response - ${JSON.stringify(error.response?.data)}`,
      );
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode,
      };
    } else {
      console.log(
        `DeleteMFADevices Failed with Error - ${JSON.stringify(error)}`,
      );
      throw 'An error occured';
    }
  }
}
