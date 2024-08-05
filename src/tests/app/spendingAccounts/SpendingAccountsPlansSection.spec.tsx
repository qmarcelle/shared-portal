import RelatedLinks from '@/app/spendingAccounts/components/RelatedLinks';
import { SpendingAccountsBalance } from '@/app/spendingAccounts/components/SpendingAccountsBalance';
import SpendingAccount from '@/app/spendingAccounts/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <SpendingAccount />
      <SpendingAccountsBalance
        details={[
          {
            label: '2023',
            value: '0',
          },
          {
            label: '2022',
            value: '1',
          },
          {
            label: '2021',
            value: '2',
          },
        ]}
        onSelectedDetailChange={() => {}}
        selectedDetailId="0"
        contributionsAmount={1200.0}
        distributionsAmount={850.0}
        balanceAmount={0.0}
        transactionsLabel="View FSA Transactions"
        spendingBalanceTitle="Flexible Spending Account Balance"
      />
      ,
      <RelatedLinks />,
    </>,
  );
};

describe('TransactionCardSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Spending Accounts' });
    screen.getByText('To manage your health spending account details');
    screen.getAllByText('View FSA Transactions');
    screen.getAllByText('Flexible Spending Account Balance');
    screen.getAllByText('Get Help With Your Spending Accounts');
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Spending Accounts' });
    screen.getByText('To manage your health spending account details');
    screen.getAllByText('View FSA Transactions');
    screen.getAllByText('Flexible Spending Account Balance');
    screen.getAllByText('Get Help With Your Spending Accounts');
    expect(component.baseElement).toMatchSnapshot();
  });
});
