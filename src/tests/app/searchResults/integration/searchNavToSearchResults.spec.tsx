process.env.SAPPHIRE_SEARCH_RADIUS = '35';
process.env.SAPPHIRE_SEARCH_LIMIT = '6';

import { SearchNavigation } from '@/components/composite/SearchNavigation';
import { fusionSearchMockResp } from '@/mock/fusion_search/fusionSearchMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const mockedPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
      push: mockedPush,
      refresh: () => null,
    };
  },
}));

const renderUI = () => {
  return render(<SearchNavigation />);
};

describe('SearchNavigation', () => {
  it('should navigate to SearchResults Page on pressing Enter', async () => {
    mockedAxios.post.mockResolvedValue({
      data: fusionSearchMockResp,
    });
    jest.useFakeTimers();
    renderUI();
    //Search Text with search Icon should be visible in UI
    expect(screen.getByText('Search')).toBeVisible();
    fireEvent.click(screen.getByAltText('Search'));
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

    jest.useRealTimers();
    await userEvent.keyboard('{Enter}');
    expect(mockedPush).toHaveBeenCalled();
  });
});
