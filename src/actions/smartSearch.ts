'use server';

import { ESResponse } from '@/models/enterprise/esResponse';
import {
  SmartSearchRequest,
  SmartSearchResponse,
} from '@/models/enterprise/smartSearch';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';

export async function invokeSmartSearch(
  request: SmartSearchRequest,
): Promise<ESResponse<SmartSearchResponse>> {
  try {
    const resp = await esApi.post<ESResponse<SmartSearchResponse>>(
      '/smartSearch/suggestion',
      request,
    );
    return resp.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      //logger.error("Response from API " + error.response?.data);
      logger.error('Error in Login');
      console.error(error.response?.data);
      return { errorCode: error.response?.data?.data?.errorCode };
    } else {
      throw error;
    }
  }
}
