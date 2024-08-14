'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { AxiosError } from 'axios';
import {
  VerifyMfaRequest,
  VerifyMfaResponse,
} from '../models/verify_mfa_devices';

export async function verifyMfaDevices(
  request: VerifyMfaRequest,
): Promise<ESResponse<VerifyMfaResponse>> {
  try {
    request.userId = await getServerSideUserId();
    const axiosResponse = await esApi.post(
      '/mfAuthentication/verifyDevices',
      request,
    );
    console.log(
      `VerifyMFADevices Success Response - ${JSON.stringify(axiosResponse.data)}`,
    );
    return axiosResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response form API' + error.response?.data);
      console.log(
        `VerifyMFaDevices Failed With Error Code - ${error.response?.data?.data?.errorCode}, Error Response - ${JSON.stringify(error.response?.data)}`,
      );
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode,
      };
    } else {
      console.log(
        `VerifyMFADevices Failed with Error - ${JSON.stringify(error)}`,
      );
      throw 'An error occured';
    }
  }
}
