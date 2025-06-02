'use client';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { FilterDetails, FilterItem } from '@/models/filter_dropdown_details';
import { useEffect, useState } from 'react';
import { HealthAccountInfo } from '../model/myHealthCareResponseDTO';
import { spendingAccountsStore } from '../stores/spendingAccountsStore';
import { fetchTransactions } from './actions/fetchTransactions';
import {
  sortByDateHighToLow,
  sortByStatus,
  sortByTransactionTotalHighToLow,
  sortByTransactionTotalLowToHigh,
} from './actions/transactionSorts';
import { TransactionCard } from './components/TransactionCard';

export interface TransactionsProps {
  accountInfo: HealthAccountInfo;
}

const Transactions = ({ accountInfo }: TransactionsProps) => {
  const { healthCareAccountBalance, transactions, setTransactions } =
    spendingAccountsStore();

  const dateOptions: FilterDetails[] = [
    { label: 'Last 30 days', value: '1', id: '1' },
    { label: 'Last 60 days', value: '2', id: '2' },
    { label: 'Last 90 days', value: '3', id: '3' },
    { label: 'Last 120 days', value: '4', id: '4' },
    { label: 'Current Calendar Year', value: '5', id: '5' },
    { label: 'Last Calendar Year', value: '6', id: '6' },
    { label: 'Last Two Years', value: '7', id: '7' },
  ];

  const [selectedAccountType, setSelectedAccountType] = useState<FilterDetails>(
    {
      label: accountInfo.accountTypes[0] || 'Choose Account', // Fallback value
      value: '0',
      id: '0',
    },
  );

  const [selectedDateRange, setSelectedDateRange] = useState<FilterDetails>(
    dateOptions[3] || { label: 'Last 120 days', value: '4', id: '4' },
  );

  function onFilterSelect(index: number, data: FilterItem[]) {
    // Handle filter selection
    if (data[index]) {
      if (index === 0) {
        setSelectedAccountType(
          data[index].selectedValue ?? selectedAccountType,
        );
      } else if (index === 1) {
        setSelectedDateRange(data[index].selectedValue ?? selectedDateRange);
      }
    }
  }

  useEffect(() => {
    const dates = getFromDateFromId(selectedDateRange.id);
    fetchTransactions(selectedAccountType.label, dates.fromDate, dates.toDate)
      .then((fetchedTransactions) => setTransactions(fetchedTransactions))
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, [setTransactions, selectedAccountType.label, selectedDateRange.id]);

  return (
    <section className="flex flex-row items-start app-body mt-8" id="Filter">
      <Column className=" flex-grow page-section-36_67 items-stretch">
        <Filter
          className="large-section px-0 m-0"
          filterHeading="Filter Transactions"
          onReset={() => {}}
          showReset={false}
          onSelectCallback={(index, data) => onFilterSelect(index, data)}
          filterItems={[
            {
              type: 'dropdown',
              label: 'Account Type',
              value: accountInfo.accountTypes.map((type, index) => ({
                label: type,
                value: `${index + 1}`,
                id: `${index + 1}`,
              })),
              selectedValue: selectedAccountType,
            },
            {
              type: 'dropdown',
              label: 'Date Range',
              value: dateOptions,
              selectedValue: selectedDateRange,
            },
          ]}
        />
      </Column>

      <Column className="flex-grow page-section-63_33 items-stretch">
        <TransactionCard
          sortBy={[
            {
              id: '1',
              label: 'Date (Most Recent)',
              value: '1',
              sortFn: sortByDateHighToLow,
            },
            {
              id: '2',
              label: 'Status (Denied First)',
              value: '2',
              sortFn: sortByStatus,
            },
            {
              id: '3',
              label: 'Amount (High to Low)',
              value: '3',
              sortFn: sortByTransactionTotalHighToLow,
            },
            {
              id: '0',
              label: 'Amount (Low to High)',
              value: '0',
              sortFn: sortByTransactionTotalLowToHigh,
            },
          ]}
          transactionsInfo={transactions}
          healthCareAccountBalance={healthCareAccountBalance}
        />
      </Column>
    </section>
  );
};

function getFromDateFromId(id: string): { fromDate: Date; toDate: Date } {
  const today = new Date();
  const fromDate = new Date();
  const toDate = new Date();
  switch (id) {
    case '1':
      fromDate.setDate(today.getDate() - 30);
      break;
    case '2':
      fromDate.setDate(today.getDate() - 60);
      break;
    case '3':
      fromDate.setDate(today.getDate() - 90);
      break;
    case '4':
      fromDate.setDate(today.getDate() - 120);
      break;
    case '5':
      fromDate.setFullYear(today.getFullYear(), 0, 1);
      toDate.setFullYear(today.getFullYear(), 11, 31);
      break;
    case '6':
      fromDate.setFullYear(today.getFullYear() - 1, 0, 1);
      toDate.setFullYear(today.getFullYear() - 1, 11, 31);
      break;
    case '7':
      fromDate.setFullYear(today.getFullYear() - 2);
      toDate.setTime(today.getTime());
      break;
    default:
      break;
  }
  return { fromDate, toDate };
}

export default Transactions;
