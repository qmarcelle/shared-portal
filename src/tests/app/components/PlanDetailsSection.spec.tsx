import { render, screen } from '@testing-library/react';
import { PlanDetailsSection } from '../../../app/(main)/myPlan/components/PlanDetailsSection';

const renderUI = () => {
  render(<PlanDetailsSection />);
};

describe('PlanDetailsSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Plan Details' });
    screen.getByText('Plan Type:');
    screen.getByText(
      'High Deductible Health Plan with Health Savings Account (HDHP-HSA)',
    );
    screen.getByText('All members of your plan use the same ID card.');
    screen.getByText('View More ID Card Options');

    expect(component).toMatchSnapshot();
  });
});
