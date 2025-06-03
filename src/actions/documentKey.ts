'use server';

import { DocumentKeyRequest } from '@/models/documentKey_details';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';

export async function getDocumentKey(
  docRequest: DocumentKeyRequest,
): Promise<string> {
  try {
    const response = await memberService.post(
      '/api/v1/documentKey',
      docRequest,
    );
    logger.info('POST documentKey response :: ', response?.data);
    return response?.data.docKey;
  } catch (error) {
    logger.error('Error Response from documentKey API', error);
    throw error;
  }
}
