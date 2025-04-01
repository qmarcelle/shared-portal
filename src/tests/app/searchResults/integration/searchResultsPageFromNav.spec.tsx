import SearchResults from '@/app/searchResults/page';
import { fusionSearchResultsFullMockResp } from '@/mock/fusion_search/fusionSearchResultsFullMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

mockedAxios.get.mockResolvedValueOnce({
  data: fusionSearchResultsFullMockResp,
});

jest.mock('next/navigation', () => ({
  useSearchParams() {
    return {
      get: () => 'health',
    };
  },
}));

describe('Search Results Page', () => {
  it('should search the text it received from query param', async () => {
    render(<SearchResults />);
    await waitFor(() => {
      // call the api correctly
      expect(mockedAxios.get).toHaveBeenCalledWith('/smartSearch/inquiry', {
        params: {
          apps: 'MAIN',
          collections: 'MAIN',
          cursorValue: 0,
          fieldList:
            'score,id,mime_type,parent_s,fetchedDate_dt,title,highlighting,description,data_source,BCBS_SEC_FILTERS_s',
          inquiry: 'health',
          membersDocAllowList: '',
          numberOfRows: 30,
          qpParams: 'member',
          qryPipeline: 'MAIN',
          sortBy: 'score',
        },
      });
      // Shows the result
      expect(
        screen.getByText('508C Bluecare Tennessee Lab Exclusion List'),
      ).toBeVisible();
      expect(screen.getByText('20 Results for health')).toBeVisible();
    });
  });
});
