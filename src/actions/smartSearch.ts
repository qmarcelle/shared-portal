'use server';

import { auth } from '@/auth';
import { fusionSearchMockWithAllSet } from '@/mock/fusion_search/fusionSearchMockWithAllSets';
import { fusionSearchResultsInquiryMockResp } from '@/mock/fusion_search/fusionSearchResultsInquiryMockResp';
import { ActionResponse } from '@/models/app/actionResponse';
import { ESResponse } from '@/models/enterprise/esResponse';
import { SmartSearchRequest } from '@/models/enterprise/smartSearch';
import {
  SmartSearchInquiryResponse,
  SmartSearchInquiryResult,
} from '@/models/enterprise/smartSearchInquiryResponse';
import {
  SmartSearchResponse,
  SmartSearchSuggestionResponse,
} from '@/models/enterprise/smartSearchResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';

export async function invokeSmartSearch(
  searchString: string,
): Promise<ActionResponse<number, SmartSearchSuggestionResponse>> {
  try {
    const session = await auth();
    const smartSearchRequest: SmartSearchRequest = {
      inquiry: `${searchString}*`,
      query: 'MAIN_TYPEAHEAD_entity_QPF',
      qpParams: 'member',
      sapphire: {
        'sapphire.radius': process.env.SAPPHIRE_SEARCH_RADIUS ?? '25',
        'sapphire.limit': process.env.SAPPHIRE_SEARCH_LIMIT ?? '4',
        'sapphire.network_id': session?.user.currUsr.plan?.ntwkId ?? '',
      },
      apps: 'MAIN',
    };

    const resp = await esApi.post<ESResponse<SmartSearchResponse>>(
      '/smartSearch/suggestion',
      smartSearchRequest,
    );
    return {
      status: 200,
      data: JSON.parse(resp.data!.data!.suggestionResponse),
    };
  } catch (error) {
    logger.error('Smart Search API - Failure', error);

    //TODO: Replace mock resp with err handling when we
    //complete the results page.
    return {
      status: 200,
      data: fusionSearchMockWithAllSet,
    };
    // if (error instanceof AxiosError) {
    //   //logger.error("Response from API " + error.response?.data);
    //   return {
    //     status: 500,
    //     error: error.response?.data?.data?.errorCode,
    //   };
    // } else {
    //   return {
    //     status: 500,
    //     error: {
    //       message: 'Internal Error',
    //     },
    //   };
    // }
  }
}

/**
 * Api called to fetch fusion search results for yje
 * Search Results Page
 * @param searchString The text to search
 * @param sortBy The sorting to applied
 * @returns SearchResults object wrapping the result items
 */
export async function invokeSmartSearchInquiry(
  searchString: string,
  sortBy = '',
): Promise<ActionResponse<number, SmartSearchInquiryResponse>> {
  try {
    logger.info('Making call to SmartSearch Inquiry API');
    const resp = await esApi.get<ESResponse<SmartSearchInquiryResult>>(
      '/smartSearch/inquiry',
      {
        params: {
          inquiry: searchString,
          fieldList:
            'score,id,mime_type,parent_s,fetchedDate_dt,title,highlighting,description,data_source,BCBS_SEC_FILTERS_s',
          numberOfRows: 30,
          cursorValue: 0,
          qpParams: 'member',
          apps: 'MAIN',
          qryPipeline: 'MAIN',
          collections: 'MAIN',
          sortBy,
          membersDocAllowList: '',
        },
      },
    );

    return {
      status: 200,
      data: JSON.parse(resp.data.data!.inquiryResponse),
    };
  } catch (err) {
    logger.error('Smart Search Inquiry API error', err);
    return {
      status: 200,
      data: fusionSearchResultsInquiryMockResp,
    };
  }
}
