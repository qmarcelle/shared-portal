import { SearchBanner } from '@/app/(protected)/(common)/member/searchResults/components/SearchBanner';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = () => {
  return render(<SearchBanner />);
};

describe('Search Results Page', () => {
  it('should render all the required components', () => {
    const component = setupUI();
    expect(
      screen.getByRole('heading', { name: 'Talk With a Care Provider' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Schedule an appointment or get health information 24/7 for non-emergency conditions.',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
