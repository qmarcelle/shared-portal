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
    logger.info('VerifyMFADevices API - Success', axiosResponse);
    return axiosResponse?.data;
  } catch (error) {
    logger.error('VerifyMFADevices API - Failure', error);
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
