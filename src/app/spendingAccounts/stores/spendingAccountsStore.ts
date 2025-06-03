/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionDetails } from '@/models/transaction_details';
import { create } from 'zustand';

type TransactionsState = {
  transactions: TransactionDetails[];
  healthCareAccountBalance: number;
  setHealthCareAccountBalance: (balance: number) => void;
  setTransactions: (transactions: TransactionDetails[]) => void;
};

export const spendingAccountsStore = create<TransactionsState>((set) => ({
  transactions: [] as TransactionDetails[],
  healthCareAccountBalance: 0,
  setHealthCareAccountBalance: (balance: number) =>
    set({ healthCareAccountBalance: balance }),
  setTransactions: (transactions: TransactionDetails[]) =>
    set({ transactions }),
}));
