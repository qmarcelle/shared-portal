import { InfoCard } from '@/components/composite/InfoCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FindCare from '../../../public/assets/find_care_search.svg';

const renderUI = () => {
  return render(
    <InfoCard
      icon={FindCare}
      label="Find an In-network Provider"
      body="Find a high-quality provider for either in-person or virtual telehealth appointments."
    />,
  );
};

describe('FindInNetworkProviderSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Find an In-network Provider');
    screen.getByText(
      'Find a high-quality provider for either in-person or virtual telehealth appointments.',
    );
    screen.getByAltText(/link/i);
    expect(component).toMatchSnapshot();
  });
});
