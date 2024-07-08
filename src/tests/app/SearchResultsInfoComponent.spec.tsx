import { SearchResultsInfoComponent } from '@/app/searchResults/components/SearchResultsInfoComponent';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const setupUI = () => {
  return render(<SearchResultsInfoComponent />);
};

describe('Search Results Page', () => {
  it('should render all the required components', () => {
    const component = setupUI();
    expect(screen.getByPlaceholderText('search')).toBeVisible();
    expect(screen.getByText('Sort by:')).toBeVisible();
    expect(screen.getByText(/results for/i)).toBeVisible();
    expect(
      screen.getByText(
        'Schedule an appointment or get health information 24/7 for non-emergency conditions.',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
