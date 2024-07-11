'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import {
  VerifyMfaRequest,
  VerifyMfaResponse,
} from '../models/verify_mfa_devices';

export async function verifyMfaDevices(
  request: VerifyMfaRequest,
): Promise<ESResponse<VerifyMfaResponse>> {
  try {
    const axioResponse = await esApi.post(
      '/mfAuthentication/verifyDevices',
      request,
    );
    return axioResponse?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('Response form API' + error.response?.data);
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
