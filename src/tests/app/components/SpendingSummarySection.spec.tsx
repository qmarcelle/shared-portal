import { SpendingAccountSummary } from '../../../app/dashboard/components/SpendingAccountSummary';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const renderUI = () => {
  return render(
    <SpendingAccountSummary
      className="large-section"
      dateOfAccessingPortal={'October 12, 2023'}
      amountPaid={1199.19}
      totalBilledAmount={9804.31}
      amountSaved={8605.12}
      amountSavedPercentage={89}
      color1={'#005EB9'}
      color2={'#5DC1FD'}
    ></SpendingAccountSummary>,
  );
};

describe('SpendingAccountSummary', () => {
  it('should render the UI correctly', async () => {
    renderUI();
    expect(screen.getByText('Spending Summary')).toBeVisible();
    expect(screen.getByText('You Paid')).toBeVisible();
    expect(screen.getByText('October 12, 2023')).toBeVisible();
    expect(screen.getByText('You Saved')).toBeVisible();
    expect(screen.getByText('Your plan paid')).toBeVisible;
    expect(screen.getByText('of your costs')).toBeVisible();
    expect(screen.getByText('Total Billed')).toBeVisible();
    expect(screen.getByText('View Spending Summary')).toBeVisible();
  });
});
