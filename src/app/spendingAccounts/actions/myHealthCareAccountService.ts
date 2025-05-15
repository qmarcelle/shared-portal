'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { HealthCareAccount } from '@/models/member/api/loggedInUserInfo';
import { getCurrentDate } from '@/utils/api/date';
import { SPEND_ACC_BANK_MAP, SPEND_ACC_SSO_MAP } from '@/utils/constants';
import { formatCurrency } from '@/utils/currency_formatter';
import { logger } from '@/utils/logger';
import {
  FSABean,
  HealthAccountInfo,
  HRABean,
  MyHealthCareResponseDTO,
  SpendingBalanceBean,
} from '../model/myHealthCareResponseDTO';
import { getFSAAcctDetails } from './getFSAAcctDetails';
import { getHRAInfo } from './getHRAInfo';

async function fetchFSAAccountDetails(memeCk: number): Promise<FSABean[]> {
  logger.info(`Fetching FSA Account Details for Member: ${memeCk}`);
  const fsaAccDetailsList = await getFSAAcctDetails(memeCk);
  const mappedDetails = fsaAccDetailsList.fsaAcctDetails.map((detail) => ({
    termDate: detail.termDate,
    fsaTypeInd: detail.fsaTypeInd,
    accountBalance: formatCurrency(detail.accountBalance ?? 0),
    effectiveDate: detail.effectiveDate,
    totalExpenditure: formatCurrency(detail.paidAmountYTD ?? 0),
    totalPledgeAmount: formatCurrency(
      (detail.employeePledgeAmount ?? 0) + (detail.employerPledgeAmount ?? 0),
    ),
  }));
  return mappedDetails;
}

async function processHRAInfo(memeCk: number): Promise<HRABean> {
  const hraInfo = await getHRAInfo(memeCk);
  return {
    currentBalance: formatCurrency(hraInfo.hraBalanceAvailable),
    employerAllocation: formatCurrency(hraInfo.allocationAmount),
    totalExpenditures: formatCurrency(hraInfo.hraPaidAmount),
    incentiveBalance: formatCurrency(hraInfo.vbbHRACredit),
    totalHRAAmount: formatCurrency(
      hraInfo.allocationAmount + hraInfo.vbbHRACredit,
    ),
  };
}

export async function myHealthCareAccountService(): Promise<
  ActionResponse<number, MyHealthCareResponseDTO>
> {
  const session = await auth();
  const memberDetails = await getLoggedInMember(session);
  let healthAccInfo: HealthAccountInfo[] = {} as HealthAccountInfo[];
  let healthEquity: boolean = false;
  if (
    memberDetails.healthCareAccounts &&
    memberDetails.healthCareAccounts.length > 0
  ) {
    healthAccInfo = await mapHealthAccLinksInfo(
      memberDetails.healthCareAccounts,
    );
    healthEquity = memberDetails.healthCareAccounts.some(
      (account) =>
        account.bankName && account.bankName.toLowerCase() === 'healthequity',
    );
  }
  try {
    const hraBean: HRABean = {};
    const fsaBean: FSABean[] = [];
    let spendingBalanceBean: SpendingBalanceBean[] =
      {} as SpendingBalanceBean[];

    if (session?.user?.vRules?.flexibleSpendingAccount) {
      Object.assign(
        fsaBean,
        await fetchFSAAccountDetails(memberDetails?.memeCk),
      );
    }

    if (session?.user?.vRules?.healthReimbursementAccount) {
      Object.assign(hraBean, await processHRAInfo(memberDetails?.memeCk));
    }

    if ((hraBean && !isObjectEmpty(hraBean)) || fsaBean.length > 0) {
      spendingBalanceBean = await mapSpendingAccBal(fsaBean, hraBean);
      logger.info(
        `mapSpendingAccBal Details : ${JSON.stringify(spendingBalanceBean)}`,
      );
    }

    return {
      status: 200,
      data: {
        userId: session?.user?.id,
        healthAccountInfo: healthAccInfo,
        hraBean: hraBean,
        fsaBean: fsaBean,
        spendingBalanceBean: spendingBalanceBean,
        isHealthEquity: healthEquity,
      },
    };
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - MyHealthCareService',
      error,
    );
    // this is a temporary fix and needs to fixed in future when we integrate SA with ES calls for external accounts.
    return {
      status: 200,
      data: {
        userId: session?.user?.id,
        healthAccountInfo: healthAccInfo,
        isHealthEquity: healthEquity,
      },
    };
  }
}

async function mapSpendingAccBal(
  fsaBean: FSABean[],
  hraBean: HRABean,
): Promise<SpendingBalanceBean[]> {
  const spendingBalanceBean: SpendingBalanceBean[] = [];
  const defaultAmt = '$0.00';
  try {
    if (hraBean && !isObjectEmpty(hraBean)) {
      const spendBal: SpendingBalanceBean = {} as SpendingBalanceBean;
      spendBal.planYear = new Date(getCurrentDate()).getFullYear().toString();
      spendBal.accountTypeText = 'HRA';
      spendBal.spendingBalanceTitle = 'Health Reimbursement Account';
      spendBal.transactionsLabel = 'View HRA Transactions';
      spendBal.contributionsAmount = hraBean?.totalHRAAmount || defaultAmt;
      spendBal.distributionsAmount = hraBean?.totalExpenditures || defaultAmt;
      spendBal.balanceAmount = hraBean?.currentBalance || defaultAmt;
      spendingBalanceBean.push(spendBal);
    }

    if (fsaBean.length > 0) {
      fsaBean.forEach((fsa) => {
        const spendBal: SpendingBalanceBean = {} as SpendingBalanceBean;
        const dateStr = fsa.termDate ? fsa.termDate : getCurrentDate();
        spendBal.planYear = new Date(dateStr).getFullYear().toString();
        spendBal.accountTypeText = fsa.fsaTypeInd === 'C' ? 'DCFSA' : 'FSA';
        spendBal.spendingBalanceTitle =
          fsa.fsaTypeInd === 'C'
            ? 'Dependent Care Flexible Spending Account'
            : 'Flexible Spending Account';
        spendBal.transactionsLabel = 'View FSA Transactions';
        spendBal.contributionsAmount = fsa?.totalPledgeAmount || defaultAmt;
        spendBal.distributionsAmount = fsa?.totalExpenditure || defaultAmt;
        spendBal.balanceAmount = fsa?.accountBalance || defaultAmt;
        spendingBalanceBean.push(spendBal);
      });
    }
  } catch (err) {}

  return spendingBalanceBean;
}

function isObjectEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

async function mapHealthAccLinksInfo(healthCareAccounts: HealthCareAccount[]) {
  return healthCareAccounts.map((acc) => ({
    bankName: acc.bankName,
    accountType: acc.accountType,
    linkName: SPEND_ACC_BANK_MAP[acc.bankName.toLowerCase()] || '',
    linkUrl: SPEND_ACC_SSO_MAP[acc.bankName.toLowerCase()] || '',
  }));
}
