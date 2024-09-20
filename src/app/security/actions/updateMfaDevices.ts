'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { AxiosError } from 'axios';
import {
  UpdateMfaRequest,
  UpdateMfaResponse,
} from '../models/update_mfa_devices';

export async function updateMfaDevices(
  request: UpdateMfaRequest,
): Promise<ESResponse<UpdateMfaResponse>> {
  request.userId = await getServerSideUserId();
  try {
    const axiosResponse = await esApi.post(
      '/mfAuthentication/updateDevices',
      request,
    );
    logger.info('UpdateMFADevices API - Success', axiosResponse);
    return axiosResponse?.data;
  } catch (error) {
    logger.error('UpdateMFADevices API - Failure', error);
    if (error instanceof AxiosError) {
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode,
      };
    } else {
      throw 'An error occured';
    }
  }
}
