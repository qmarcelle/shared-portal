'use server';

import { signIn } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { UNIXTimeSeconds } from '@/utils/date_formatter';
import { encrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { setWebsphereRedirectCookie } from '@/utils/wps_redirect';
import { AxiosError } from 'axios';
import { PasswordResetRequest } from '../models/api/password_reset_request';
import { PasswordResetResponse } from '../models/api/password_reset_response';
import { PasswordResetStatus } from '../models/status';

export async function callResetPassword(
  request: PasswordResetRequest,
): Promise<ActionResponse<PasswordResetStatus, PasswordResetResponse>> {
  let status: PasswordResetStatus = PasswordResetStatus.ERROR;
  try {
    request.appId = process.env.ES_API_APP_ID;
    const resp = await esApi.post<ESResponse<PasswordResetResponse>>(
      '/mfAuthentication/loginAuthentication/passwordReset',
      request,
    );
    logger.info('Reset Password API - Success', resp, request.username);

    if (
      resp.data.data?.message == 'COMPLETED' ||
      resp.data.data?.message == 'MFA_Disabled'
    ) {
      await setWebsphereRedirectCookie({
        ...resp.data.data,
      });
      status = PasswordResetStatus.RESET_OK;
    }
    if (!resp.data.data) throw 'Invalid API response'; //Unlikely to ever occur but needs to be here to appease TypeScript on the following line
    return {
      status,
      data: {
        ...resp.data.data,
        userToken: encrypt(
          JSON.stringify({
            user: request.username,
            time: UNIXTimeSeconds(),
          }),
        ),
      },
    };
  } catch (error) {
    logger.error('Password Reset API - Failure', error, request.username);
    if (error instanceof AxiosError) {
      const errorCode =
        error.response?.data.data?.errorCode ??
        error.response?.data.details?.returnCode;
      switch (errorCode) {
        case 'FPR-400-1':
          status = PasswordResetStatus.PREVIOUS_PASSWORD;
          break;
        case 'FPR-400-2':
          status = PasswordResetStatus.COMMON_PASSWORD;
          break;
        case 'FPR-400-3':
          status = PasswordResetStatus.DOB_NOT_MATCHED;
          break;
        default:
          status = PasswordResetStatus.ERROR;
          break;
      }
      return {
        status: status,
        data: error.response?.data.data,
        error: {
          errorCode: errorCode,
          message: error.response?.data,
        },
      };
    } else {
      throw error;
    }
  }
}

export async function redirectToDashboard(userId: string) {
  await signIn('credentials', {
    userId: userId,
    redirect: false,
  });
}
