'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { UpdateEmailRequest } from '../models/api/update_email_request';
import { UpdateEmailResponse } from '../models/api/update_email_response';
import { EmailUniquenessStatus } from '../models/status';

export async function callUpdateEmail(
  request: UpdateEmailRequest,
): Promise<ActionResponse<EmailUniquenessStatus, UpdateEmailResponse>> {
  let status: EmailUniquenessStatus = EmailUniquenessStatus.ERROR;
  try {
    request.appId = process.env.ES_API_APP_ID;
    const resp = await esApi.post<ESResponse<UpdateEmailResponse>>(
      '/mfAuthentication/loginAuthentication/updateEmail',
      request,
    );
    logger.info('Update Email - Success', resp, request.newEmail);

    if (resp.data.data?.message == 'EMAIL_VERIFICATION_REQUIRED')
      status = EmailUniquenessStatus.VERIFY_EMAIL;

    if (!resp.data.data) throw 'Invalid API response'; //Unlikely to ever occur but needs to be here to appease TypeScript on the following line
    return {
      status,
      data: {
        ...resp.data.data,
      },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error.response?.data.data?.errorCode) {
        case 'EU-400-1':
          status = EmailUniquenessStatus.INVALID_EMAIL;
          break;
        case 'EU-400-2':
          status = EmailUniquenessStatus.EMAIL_ALREADY_IN_USE;
          break;
        default:
          status = EmailUniquenessStatus.ERROR;
          break;
      }
      return {
        status: status,
        data: error.response?.data.data,
        error: {
          errorCode: error.response?.data.data.errorCode,
          message: error.response?.data,
        },
      };
    } else {
      throw error;
    }
  }
}
