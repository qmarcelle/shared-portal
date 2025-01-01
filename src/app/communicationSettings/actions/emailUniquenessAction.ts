'use server';

import { auth } from '@/auth';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import {
  EmailUniquenessRequest,
  EmailUniquenessResponse,
} from '../models/api/emailUniqueness';

export async function invokeUpdateEmailAddress(
  request: EmailUniquenessRequest,
): Promise<ESResponse<EmailUniquenessResponse>> {
  try {
    const session = await auth();
    const emailRequest: EmailUniquenessRequest = {
      emailAddress: request.emailAddress,
      memberKey: session?.user.currUsr?.plan.memCk,
      subscriberKey: session?.user.currUsr?.plan.sbsbCk,
    };
    const response = await esApi.post<ESResponse<EmailUniquenessResponse>>(
      '/memberEmailAddress',
      emailRequest,
    );
    return response?.data;
  } catch (error) {
    logger.error('emailUniqueness for updating the email - Failure', error);
    if (error instanceof AxiosError) {
      return {
        errorCode:
          error.response?.data?.data?.errorCode ??
          error.response?.data?.details?.returnCode ??
          '500',
      };
    } else {
      return {
        errorCode: '500',
      };
    }
  }
}
