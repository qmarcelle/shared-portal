'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import {
  EmailUniquenessResendCodeRequest,
  EmailUniquenessResendCodeResponse,
  EmailUniquenessResendCodeStatus,
} from '../models/api/email_uniqueness_resendcode_request';

export async function getEmailUniquenessResendCode(
  request: EmailUniquenessResendCodeRequest,
): Promise<
  ActionResponse<
    EmailUniquenessResendCodeStatus,
    EmailUniquenessResendCodeResponse
  >
> {
  let status: EmailUniquenessResendCodeStatus =
    EmailUniquenessResendCodeStatus.ERROR;
  try {
    request.appId = process.env.ES_API_APP_ID;
    logger.info('Email Uniqueness Resend OTP  - Request', request);
    const resp = await esApi.post<
      ESResponse<EmailUniquenessResendCodeResponse>
    >('/mfAuthentication/loginAuthentication/resendOtp', request);
    logger.info('Email Uniqueness Resend OTP  - Success', resp);

    if (resp.data.data?.message == 'EMAIL_VERIFICATION_REQUIRED')
      status = EmailUniquenessResendCodeStatus.RESEND_OTP;

    if (!resp.data.data) throw 'Invalid API response';
    return {
      status,
      data: {
        ...resp.data.data,
      },
    };
  } catch (error) {
    logger.error('Resend  OTP API - Failure', error);

    if (error instanceof AxiosError) {
      const errorCode =
        error.response?.data.data?.errorCode ??
        error.response?.data.details?.returnCode;
      switch (errorCode) {
        default:
          status = EmailUniquenessResendCodeStatus.ERROR;
          break;
      }
      return {
        status: status,
        data: error.response?.data.data,
        error: {
          errorCode:
            error.response?.data.data.errorCode ??
            error.response?.data.details?.returnCode,
          message: error.response?.data,
        },
      };
    } else {
      throw error;
    }
  }
}
