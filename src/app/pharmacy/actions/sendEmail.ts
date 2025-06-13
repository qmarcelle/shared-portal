import 'server-only';

import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { SendEmailRequest, SendEmailResponse } from '../models/sendEmail';

export async function sendEmail(
  request: SendEmailRequest,
): Promise<SendEmailResponse> {
  try {
    const response = await memberService.post<SendEmailResponse>(
      '/api/v1/sendEmail',
      request,
    );
    logger.info('Send Email Data', response?.data);
    return response.data;
  } catch (error) {
    logger.error('Error Response from Send Email API', error);
    throw error;
  }
}
