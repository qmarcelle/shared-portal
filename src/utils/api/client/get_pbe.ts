import { pbeResponseMock } from '@/mock/pbeResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { PBEData } from '@/models/member/api/pbeData';
import { logger } from '@/utils/logger';
import { getAuthToken } from '../getToken';

export async function getPersonBusinessEntity(
  userId: string,
  needPBE: boolean = true,
  needConsent: boolean = true,
  refresh: boolean = false, //eslint-disable-line @typescript-eslint/no-unused-vars -- Stub function
): Promise<PBEData> {
  logger.info('[getPersonBusinessEntity] ENTRY', {
    userId,
    needPBE,
    needConsent,
    refresh,
  });
  try {
    const apiUrl = `${process.env.ES_API_URL}/searchMemberLookupDetails/getPBEConcentDetails?userName=${userId}&isPBERequired=${needPBE}&isConsentRequired=${needConsent}`;
    logger.info('[getPersonBusinessEntity] API URL', {
      apiUrl,
      env: process.env.NODE_ENV,
    });
    logger.info('[getPersonBusinessEntity] ES_API_URL', {
      ES_API_URL: process.env.ES_API_URL,
    });
    const authToken = await getAuthToken();
    logger.info('[getPersonBusinessEntity] Auth token status', {
      hasToken: !!authToken,
    });
    const resp = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
      cache: refresh ? 'no-store' : undefined,
      next: {
        revalidate: !refresh ? 1800 : undefined,
        tags: [userId],
      },
    });
    logger.info('[getPersonBusinessEntity] API Response Status', {
      status: resp.status,
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      logger.error('[getPersonBusinessEntity] API Error', {
        status: resp.status,
        endpoint: apiUrl,
        responseText: errorText.slice(0, 500),
      });
      if (resp.status === 404 && process.env.NODE_ENV !== 'production') {
        logger.warn(
          '[getPersonBusinessEntity] Using mock PBE data as fallback for 404 response',
        );
        return pbeResponseMock.data;
      }
      throw new Error(`API returned status ${resp.status}`);
    }
    const contentType = resp.headers.get('content-type');
    logger.info('[getPersonBusinessEntity] API Content-Type', { contentType });
    if (!contentType || !contentType.includes('application/json')) {
      const text = await resp.text();
      logger.error(
        '[getPersonBusinessEntity] API Error: Unexpected content type',
        { contentType, responseText: text.slice(0, 500) },
      );
      throw new Error(`API returned non-JSON response: ${contentType}`);
    }
    const result = (await resp.json()) as ESResponse<PBEData>;
    if (!result || !result.data) {
      logger.error(
        '[getPersonBusinessEntity] API Error: Missing data in response',
        { result },
      );
      throw new Error('API response missing expected data');
    }
    logger.info('[getPersonBusinessEntity] PBE Data retrieved successfully', {
      dataKeys: Object.keys(result.data),
    });
    logger.info('[getPersonBusinessEntity] EXIT success', { userId });
    return result.data;
  } catch (err) {
    logger.error('[getPersonBusinessEntity] ERROR', { err });
    if (process.env.NODE_ENV !== 'production') {
      logger.warn(
        '[getPersonBusinessEntity] Using mock PBE data as fallback after error',
      );
      return pbeResponseMock.data;
    }
    throw err;
  }
}
