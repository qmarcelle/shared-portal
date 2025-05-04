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
  try {
    const apiUrl = `${process.env.ES_API_URL}/searchMemberLookupDetails/getPBEConcentDetails?userName=${userId}&isPBERequired=${needPBE}&isConsentRequired=${needConsent}`;
    
    logger.info(`Calling PBE API: ${apiUrl}`);
    
    const resp = await fetch(
      apiUrl,
      {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
          'Accept': 'application/json',
        },
        cache: refresh ? 'no-store' : undefined,
        next: {
          revalidate: !refresh ? 1800 : undefined,
          tags: [userId],
        },
      },
    );

    if (!resp.ok) {
      // Handle non-200 responses
      const errorText = await resp.text();
      logger.error(`PBE API Error: Status ${resp.status}`, { 
        status: resp.status, 
        endpoint: apiUrl,
        responseText: errorText.slice(0, 500) // Log part of the response for debugging
      });
      throw new Error(`API returned status ${resp.status}`);
    }

    // Check if response is JSON
    const contentType = resp.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await resp.text();
      logger.error('PBE API Error: Unexpected content type', { 
        contentType,
        responseText: text.slice(0, 500) // Log part of the response for debugging
      });
      throw new Error(`API returned non-JSON response: ${contentType}`);
    }

    const result = (await resp.json()) as ESResponse<PBEData>;

    if (!result || !result.data) {
      logger.error('PBE API Error: Missing data in response', result);
      throw new Error('API response missing expected data');
    }

    logger.info('PBE Data retrieved successfully');
    return result.data;
  } catch (err) {
    logger.error('PBE Api Error', err);
    //TODO: Remove returning the mocked pbe Response and rethrow error
    //once we have enough test data.
    //return pbeWithMemberMultiplePRMultiplePlans.data;
    throw err;
  }
}
