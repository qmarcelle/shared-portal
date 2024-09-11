import { PriceDentalCareCard } from '@/app/priceDentalCare/components/PriceDentalCareCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PriceDentalCareCard
      procedures={[
        {
          id: '1',
          label: 'Find a Dentist',
          body: 'Get started searching for a dentist near you.',
          icon: '',
          link: '',
        },
      ]}
      showEstimateCost={true}
    />,
  );
};

describe('PriceDentalCareCard', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Procedure')).toBeVisible();
    expect(screen.getByText('Customary Cost')).toBeVisible();
    expect(screen.getAllByText('Network Allowance'));
    expect(screen.getByText('Find a Dentist')).toBeVisible();
    expect(
      screen.getAllByText('Get started searching for a dentist near you.'),
    );

    expect(component).toMatchSnapshot();
  });
});
