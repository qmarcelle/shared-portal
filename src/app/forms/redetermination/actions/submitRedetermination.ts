'use server';

import { formsService } from '@/utils/api/forms';
import { logger } from '@/utils/logger';
import { RedeterminationFormData } from '../types/RedeterminationFormTypes';

export async function submitRedetermination(
  formData: RedeterminationFormData,
): Promise<void> {
  try {
    logger.info('Submit Redetermination Data');
    const response = await formsService.post(
      '/api/v1/redetermination',
      formData,
    );
    logger.info('Response from Redetermination API', response?.data);
    if (response.status === 200) {
      logger.info('Redetermination submitted successfully');
    } else {
      logger.error('Error submitting redetermination', response);
      throw new Error('Error submitting redetermination');
    }
  } catch (error) {
    logger.error('Error Response from Policy Redetermination API', error);
    throw error;
  }
}
