'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { GetMfaDevices } from '../models/get_mfa_devices';

export async function getMfaDevices(
  userId: string, //TODO Do not take the username from client. This is a security risk. Use auth() to retrieve username from the JWT in server actions. Leaving this in for testing until the LoggedInUser backend is integrated
): Promise<ESResponse<GetMfaDevices>> {
  try {
    const request = {
      userId,
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
