import SearchResults from '@/app/searchResults/page';
import { fusionSearchResultsFullMockResp } from '@/mock/fusion_search/fusionSearchResultsFullMockResp';
import { fusionSearchResultsWithBannerMockResp } from '@/mock/fusion_search/fusionSearchResultsWithBannerMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

mockedAxios.get
  .mockResolvedValueOnce({
    data: fusionSearchResultsFullMockResp,
  })
  .mockResolvedValueOnce({
    data: fusionSearchResultsWithBannerMockResp,
  });

describe('Search Results Page', () => {
  it('sorts the results by calling api with correct sort params', async () => {
    render(<SearchResults />);
    const searchBox = await screen.findByPlaceholderText('search');
    await userEvent.type(searchBox, 'health');
    await waitFor(async () => {
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

    fireEvent.click(screen.getAllByText('Most Relevant')[0]);
    fireEvent.click(screen.getByText('Oldest'));
    await waitFor(() => {
      // calls the api with sort val
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
          sortBy: 'oldest',
        },
      });

      expect(
        screen.getByText('508C Bluecare Tennessee Lab Exclusion List Diff'),
      ).toBeVisible();
    });
  });
});
