import { SearchDetails } from '@/models/app/searchDetails';
import { SmartSearchSuggestionResponse } from '@/models/enterprise/smartSearchResponse';

export function transformSearchResponseToDetails(
  resp: SmartSearchSuggestionResponse,
): SearchDetails[] {
  const resultDetails: SearchDetails[] = [];
  const names = Object.values(resp.fusion.sapphire.providers);
  const specialties = Object.values(resp.fusion.sapphire.specialties);
  const results = resp.grouped.cleantitle_lc_s.doclist;

  if (results.docs.length > 0) {
    resultDetails.push({
      header: 'Results',
      content: results.docs.slice(0, 5).map((item) => ({
        label: item.title,
        url: item.id,
      })),
    });
  }

  if (names.length > 0) {
    resultDetails.push({
      header: 'Names',
      content: names.slice(0, 5).map((item) => ({
        label: item.name,
        url: item.url,
        metadata: item.specialty,
      })),
    });
  }

  if (specialties.length > 0) {
    resultDetails.push({
      header: 'Specialties',
      content: specialties.slice(0, 5).map((item) => ({
        label: item.name,
        url: item.url,
      })),
    });
  }

  return resultDetails;
}
