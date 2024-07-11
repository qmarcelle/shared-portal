import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FindInNetworkProviderSection } from '../../../../app/mentalHealthOptions/components/FindInNetworkProviderSection';

const renderUI = () => {
  return render(<FindInNetworkProviderSection />);
};

describe('FindInNetworkProviderSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Find an In-network Provider');
    screen.getByText(
      'Find a high-quality provider for either in-person or virtual telehealth appointments.',
    );
    screen.getByAltText(/FindCare/i);
    expect(component).toMatchSnapshot();
  });
});
