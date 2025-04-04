import { SearchResultItem } from '@/app/searchResults/models/search_result_item';
import { SmartSearchInquiryResponse } from '@/models/enterprise/smartSearchInquiryResponse';

export function transformFusionSearchInquiryIntoDetails(
  searchInquiryResp: SmartSearchInquiryResponse,
): SearchResultItem[] {
  return searchInquiryResp.response.docs
    .filter((item) => item.title || item.description)
    .map((item) => ({
      title: item.title ?? 'Title',
      description: item.description ?? 'Description',
      linkURL: item.id,
    }));
}
