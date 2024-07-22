'use server';

import { auth } from '@/auth';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { GetMfaDevices } from '../models/get_mfa_devices';

export async function getMfaDevices(): Promise<ESResponse<GetMfaDevices>> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw 'Not logged in';
    }
    const request = {
      userId: session.user.userName,
    };
    const axioResponse = await esApi.post(
      '/mfAuthentication/getDevices',
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
