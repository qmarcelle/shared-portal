import { SearchNavigation } from '@/components/composite/SearchNavigation';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { mockedAxios } from '../_mocks_/axios';

const renderUI = () => {
  return render(<SearchNavigation />);
};

describe('SearchNavigation', () => {
  it('should render the UI correctly', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { suggestionResponse: 'teladoc' } },
    });
    jest.useFakeTimers();
    const component = renderUI();
    //Search Text with search Icon should be visible in UI
    expect(screen.getByText('Search')).toBeVisible();
    fireEvent.click(screen.getByAltText('Search'));
    //On Click on Search Icon, we need to see search textBox
    expect(screen.getByRole('textbox')).toBeVisible();
    await act(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'teladoc' } });
      jest.runAllTimers();
    });
    //On Entering search Text, we need to see search results
    expect(screen.getByText('See all results for'));
    expect(component).toMatchSnapshot();
    fireEvent.click(screen.getByAltText('CloseIcon'));
    const document = screen.queryByRole('textbox');
    //On Click on Close Icon, we should not see search textBox
    expect(document).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
    jest.useRealTimers();
  });
});
