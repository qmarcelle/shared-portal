import { SpendingAccountSection } from '@/app/(common)/myplan/benefits/balances/components/SpendingAccountsSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <SpendingAccountSection
      className="large-section"
      fsaBalance={1009.5}
      hsaBalance={349.9}
      linkURL=""
    />,
  );
};

describe('SpendingAccountsSection', () => {
  it('should render the UI correctly', async () => {
    renderUI();
    expect(screen.getByText('Spending Accounts')).toBeVisible();
    expect(screen.getByText('HSA')).toBeVisible();
    expect(screen.getByText('Health Saving Account Balance')).toBeVisible();
    expect(screen.getByText('$349.90')).toBeVisible();
    expect(screen.getByText('$1,009.50')).toBeVisible();
    expect(screen.getByText('FSA')).toBeVisible();
    expect(screen.getByText('Flexible Spending Account Balance')).toBeVisible();
    expect(screen.getByText('View Spending Accounts')).toBeVisible();
  });
});
