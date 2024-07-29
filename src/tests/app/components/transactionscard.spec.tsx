import { TransactionCard } from '@/app/transactions/components/TransactionCard';
import { Filter } from '@/components/foundation/Filter';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <Filter
        className="large-section px-0 m-0"
        filterHeading="Filter Transactions"
        dropDown={[
          {
            dropNownName: 'Account Type',
            dropDownval: [
              {
                label: 'HSA',
                value: '1',
                id: '1',
              },
              {
                label: 'RSA',
                value: '2',
                id: '2',
              },
            ],
            selectedValue: { label: 'HSA', value: '1', id: '1' },
          },
          {
            dropNownName: 'Date Range',
            dropDownval: [
              {
                label: 'Last 30 days',
                value: '1',
                id: '1',
              },
              {
                label: 'Last 60 days',
                value: '2',
                id: '2',
              },
              {
                label: 'Last 90 days',
                value: '3',
                id: '3',
              },
              {
                label: 'Last 120 days',
                value: '4',
                id: '4',
              },
            ],
            selectedValue: {
              label: 'Last two Years',
              value: '4',
              id: '4',
            },
          },
        ]}
      />
      ,
      <TransactionCard
        sortby={[
          {
            label: 'Date (Most Recent)',
            value: '43',
          },
          {
            label: 'Status (Denied First)',
            value: '2',
          },
        ]}
        onSelectedDateChange={() => {}}
        selectedDate="43"
        transactions={[
          {
            id: 'Claim1',
            memberName: 'Marcus Howard',
            serviceDate: '01/23/23',
            transactionTotal: '-$780.74',
            transactionStatus: 'Approved',
            transactionId: 'ABC1234567890',
            disallowedAmount: '429.29',
            disallowedReason: 'Funds Exausted',
            transactionInfo: {},
            disallowedFlag: false,
          },
        ]}
      />
      ,
    </>,
  );
};

describe('TransactionCardSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Transactions' });
    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');
    expect(screen.getByText('Account Type')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();
    screen.getByText('Marcus Howard');
    screen.getByText('Date Recieved:01/23/23');
    let fullSharingBody = screen.queryByText('Transaction ID: ABC1234567890');
    fireEvent.click(screen.getByText('Marcus Howard')); //check that body text is visible after clicking
    fullSharingBody = screen.getByText('Transaction ID: ABC1234567890');

    expect(fullSharingBody).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI();

    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');

    screen.getByText('Marcus Howard');
    screen.getByText('Date Recieved:01/23/23');
    let fullSharingBody = screen.queryByText('Transaction ID: ABC1234567890');
    fireEvent.click(screen.getByText('Marcus Howard')); //check that body text is visible after clicking
    fullSharingBody = screen.getByText('Transaction ID: ABC1234567890');
    expect(fullSharingBody).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
