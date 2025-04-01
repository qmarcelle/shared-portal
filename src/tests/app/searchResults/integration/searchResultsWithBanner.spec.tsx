import SearchResults from '@/app/searchResults/page';
import { fusionSearchResultsWithBannerMockResp } from '@/mock/fusion_search/fusionSearchResultsWithBannerMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

mockedAxios.get.mockResolvedValueOnce({
  data: fusionSearchResultsWithBannerMockResp,
});

describe('Search Results Page', () => {
  it('should show all the results with banner correctly on searching from search bar', async () => {
    const { container } = render(<SearchResults />);
    const searchBox = await screen.findByPlaceholderText('search');
    await userEvent.type(searchBox, 'health');
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
        screen.getByText('508C Bluecare Tennessee Lab Exclusion List Diff'),
      ).toBeVisible();
      expect(screen.getByText('20 Results for health')).toBeVisible();

      // Shows the banner
      expect(screen.getByText('Verify Other Insurance')).toBeVisible();
      expect(container).toMatchSnapshot();
    });
  });
});
