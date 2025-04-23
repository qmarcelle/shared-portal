import SearchResults from '@/app/searchResults/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

mockedAxios.get.mockRejectedValueOnce({});

describe('Search Results Page', () => {
  it('should show error text for failed Fusion Search', async () => {
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
        screen.getByText(
          'There was a problem loading the search results. Please try refreshing the page or returning to this page later.',
        ),
      ).toBeVisible();
      expect(container).toMatchSnapshot();
    });
  });
});
