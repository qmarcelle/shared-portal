process.env.SAPPHIRE_SEARCH_RADIUS = '35';
process.env.SAPPHIRE_SEARCH_LIMIT = '6';

import { SearchNavigation } from '@/components/composite/SearchNavigation';
import { fusionSearchMockResp } from '@/mock/fusion_search/fusionSearchMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';

const renderUI = () => {
  return render(<SearchNavigation />);
};

describe('SearchNavigation', () => {
  it('should render the UI correctly', async () => {
    mockedAxios.post.mockResolvedValue({
      data: fusionSearchMockResp,
    });
    jest.useFakeTimers();
    const component = renderUI();
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
    expect(component).toMatchSnapshot();
    fireEvent.click(screen.getByAltText('CloseIcon'));
    const document = screen.queryByRole('textbox');
    //On Click on Close Icon, we should not see search textBox
    expect(document).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
    jest.useRealTimers();
  });
});
