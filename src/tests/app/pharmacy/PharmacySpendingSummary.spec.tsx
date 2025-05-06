import { PharmacySpendingSummary } from '@/app/(protected)/(common)/member/pharmacy/components/PharmacySpendingSummary';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PharmacySpendingSummary
      className="large-section md:w-[352px] md:h-[248px]"
      title="My Pharmacy Spending Summary"
      description="View your annual statement for your pharmacy claims."
      linkLabel="View Pharmacy Spending Summary"
    />,
  );
};

describe('PharmacySpendingSummary', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('My Pharmacy Spending Summary')).toBeVisible();
    expect(
      screen.getByText('View your annual statement for your pharmacy claims.'),
    ).toBeVisible();
    expect(screen.getByText('View Pharmacy Spending Summary')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
