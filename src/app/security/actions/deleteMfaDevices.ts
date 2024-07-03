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
    const axioResponse = await esApi.post(
      '/mfAuthentication/deleteDevices',
      request,
    );
    return axioResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response from API ' + error.response?.data);
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
