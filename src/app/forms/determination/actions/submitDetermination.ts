'use server';

import { formsService } from '@/utils/api/forms';
import { logger } from '@/utils/logger';
import { DeterminationFormData } from '../types/DeterminationFormTypes';

export async function submitDetermination(
  formData: DeterminationFormData,
): Promise<void> {
  try {
    logger.info('Submit Determination Data');
    const response = await formsService.post('/api/v1/determination', formData);
    logger.info('Response from Determination API', response?.data);
    if (response.status === 200) {
      logger.info('Determination submitted successfully');
    } else {
      logger.error('Error submitting determination', response);
      throw new Error('Error submitting determination');
    }
  } catch (error) {
    logger.error('Error Response from Policy Determination API', error);
    throw error;
  }
}
