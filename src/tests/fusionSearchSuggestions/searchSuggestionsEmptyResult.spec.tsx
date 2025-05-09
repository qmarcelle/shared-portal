process.env.SAPPHIRE_SEARCH_RADIUS = '35';
process.env.SAPPHIRE_SEARCH_LIMIT = '6';

import { SearchNavigation } from '@/components/composite/SearchNavigation';
import { fusionSearchEmptySuggesMockResp } from '@/mock/fusion_search/fusionSearchEmptySuggesMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';

const renderUI = () => {
  return render(<SearchNavigation />);
};

describe('Fusion Search Suggestion', () => {
  it('should render no results message on no results from api', async () => {
    mockedAxios.post.mockResolvedValue({
      data: fusionSearchEmptySuggesMockResp,
    });
    jest.useFakeTimers();
    const { container } = renderUI();
    //Search Text with search Icon should be visible in UI
    expect(screen.getByText('Search')).toBeVisible();
    fireEvent.click(screen.getByText('Search'));
    //On Click on Search Icon, we need to see search textBox
    expect(screen.getByRole('textbox')).toBeVisible();
    await act(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'heal' } });
      jest.runAllTimers();
    });
    //On Entering search Text, we need to see search results
    expect(screen.getByText('See all results for'));
    expect(screen.getByText('heal'));
    expect(mockedAxios.post).toHaveBeenCalledWith('/smartSearch/suggestion', {
      apps: 'MAIN',
      inquiry: 'heal*',
      qpParams: 'member',
      query: 'MAIN_TYPEAHEAD_entity_QPF',
      sapphire: {
        'sapphire.limit': '6',
        'sapphire.network_id': '',
        'sapphire.radius': '35',
      },
    });
    expect(
      screen.getByText('There are no results for your search.'),
    ).toBeVisible();
    expect(container).toMatchSnapshot();

    jest.useRealTimers();
  });
});
