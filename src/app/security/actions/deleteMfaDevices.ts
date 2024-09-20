'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { AxiosError } from 'axios';
import { DeleteMfaResponse } from '../models/delete_mfa_devices';
import { UpdateMfaRequest } from '../models/update_mfa_devices';

export async function deleteMfaDevices(
  request: UpdateMfaRequest,
): Promise<ESResponse<DeleteMfaResponse>> {
  try {
    request.userId = await getServerSideUserId();
    const axiosResponse = await esApi.post(
      '/mfAuthentication/deleteDevices',
      request,
    );
    logger.info('DeleteMFADevices API - Success', axiosResponse);
    return axiosResponse?.data;
  } catch (error) {
    logger.error('DeleteMFADevices API - Failure', error);
    if (error instanceof AxiosError) {
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode ??
          error.response?.status,
      };
    } else {
      throw 'An error occured';
    }
  }
}
