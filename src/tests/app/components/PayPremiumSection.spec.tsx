import { PayPremiumSection } from '../../../app/dashboard/components/PayPremium';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const renderUI = () => {
  return render(
    <PayPremiumSection
      className="large-section"
      dueDate="08/10/2023"
      amountDue={1000.46}
    />,
  );
};

describe('PayPremiumSection', () => {
  it('should render the UI correctly', async () => {
    renderUI();
    expect(screen.getByText('Pay Premium')).toBeVisible();
    expect(screen.getByText('Payment Due Date')).toBeVisible();
    expect(screen.getByText('Amount Due')).toBeVisible();
    expect(screen.getByText('08/10/2023')).toBeVisible();
    expect(screen.getByText('$1000.46')).toBeVisible();
    expect(screen.getByText('View or Pay Premium')).toBeVisible();
  });
});
