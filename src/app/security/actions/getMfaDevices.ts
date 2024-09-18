'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { AxiosError } from 'axios';
import { GetMfaDevices } from '../models/get_mfa_devices';

export async function getMfaDevices(): Promise<ESResponse<GetMfaDevices>> {
  try {
    const request = {
      userId: await getServerSideUserId(),
    };
    const axiosResponse = await esApi.post(
      '/mfAuthentication/getDevices',
      request,
    );
    logger.info('GetMFADevices API - Success', axiosResponse);
    return axiosResponse?.data;
  } catch (error) {
    logger.error('GetMFADevices API - Failure', error);
    if (error instanceof AxiosError) {
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode ??
          '500',
      };
    } else {
      return {
        errorCode: '500',
      };
    }
  }
}
