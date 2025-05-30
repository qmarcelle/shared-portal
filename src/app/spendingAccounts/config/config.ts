/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionDetails } from '@/models/transaction_details';
import { getInternalFSATransactionDetails } from '../actions/bcbstinternal/getInternalFSATransactionDetails';
import { internalFSATransactionMapper } from '../actions/bcbstinternal/internalFSATransactionMapper';
import {
  AccountType,
  getHEAcctData,
} from '../actions/healthEquity/getHEAcctData';

export type BankConfig = {
  [bankName: string]: {
    [accountType: string]: {
      fetchData: (fromDate: string, toDate: string) => Promise<any>;
      mapToTransactionDetails: (data: any) => TransactionDetails[];
    };
  };
};

export const bankConfig: BankConfig = {
  BCBSTInternal: {
    FSA: {
      fetchData: (fromDate: string, toDate: string) => {
        console.log('Calling BCBSTInternal FSA fetch');
        return getInternalFSATransactionDetails(fromDate, toDate);
      },
      mapToTransactionDetails: internalFSATransactionMapper,
    },
  },
  HealthEquity: {
    FSA: {
      fetchData: async (fromDate: string, toDate: string) => {
        return getHEAcctData(fromDate, toDate, AccountType.FSA);
      },
      mapToTransactionDetails: () => {
        // Placeholder for HealthEquity FSA data mapping
        return [];
      },
    },
  },
  HSABank: {
    FSA: {
      fetchData: async () => {
        // Placeholder for HSABank FSA data fetching
        return [];
      },
      mapToTransactionDetails: () => {
        // Placeholder for HSABank FSA data mapping
        return [];
      },
    },
  },
  Pinnacle: {
    FSA: {
      fetchData: async () => {
        // Placeholder for Pinnacle FSA data fetching
        return [];
      },
      mapToTransactionDetails: () => {
        // Placeholder for Pinnacle FSA data mapping
        return [];
      },
    },
  },
};
