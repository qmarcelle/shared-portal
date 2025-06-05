import 'server-only';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { getCurrentDate } from '@/utils/api/date';
import { SPEND_ACC_BANK_MAP, SPEND_ACC_SSO_MAP } from '@/utils/constants';
import { formatCurrency } from '@/utils/currency_formatter';
import { logger } from '@/utils/logger';
import { isObjectEmpty } from '@/utils/object_utils';
import { getFSAAcctDetails } from '../actions/bcbstinternal/getFSAAcctDetails';
import {
  AccountYearlyData,
  FSABean,
  HealthAccountInfo,
  HRABean,
  MyHealthCareResponseDTO,
} from '../model/myHealthCareResponseDTO';
import { SpendingBalanceYearData } from '../model/spendingBalanceYearData';
import { getHRAInfo } from './bcbstinternal/getHRAInfo';
import { mapFSABeansToSpendingBalanceBean } from './bcbstinternal/mapFSABeansToSpendingBalanceBean';

async function fetchFSAAccountDetails(memeCk: number): Promise<FSABean[]> {
  logger.info(`Fetching FSA Account Details for Member: ${memeCk}`);
  try {
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
  } catch (error) {
    logger.error(
      `Error fetching FSA Account Details for Member: ${memeCk}`,
      error,
    );
    return [];
  }
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

export async function myHealthCareAccountService(
  accountInfo: HealthAccountInfo,
): Promise<ActionResponse<number, MyHealthCareResponseDTO>> {
  const session = await auth();
  const memberDetails: LoggedInMember = await getLoggedInMember(session);
  let healthAccInfo: HealthAccountInfo[] = [];
  if (accountInfo) {
    healthAccInfo = [
      {
        bankName: accountInfo.bankName,
        accountTypes: accountInfo.accountTypes,
        linkName: SPEND_ACC_BANK_MAP[accountInfo.bankName.toLowerCase()] || '',
        linkUrl: SPEND_ACC_SSO_MAP[accountInfo.bankName.toLowerCase()] || '',
      },
    ];
  }
  try {
    const hraBean: HRABean = {
      currentBalance: '',
      employerAllocation: '',
      totalExpenditures: '',
      incentiveBalance: '',
      totalHRAAmount: '',
    };
    let acctYearlyData: AccountYearlyData[] = [];
    const fsaBean: FSABean[] = [];
    if (accountInfo?.accountTypes.includes('FSA')) {
      fsaBean.push(...(await fetchFSAAccountDetails(memberDetails?.memeCk)));
    }
    if (accountInfo?.accountTypes.includes('HRA')) {
      Object.assign(hraBean, await processHRAInfo(memberDetails?.memeCk));
    }

    if ((hraBean && !isObjectEmpty(hraBean)) || fsaBean.length > 0) {
      acctYearlyData = await mapSpendingAccBal(fsaBean, hraBean);
    } else {
      logger.info('mapSpendingAccBal Details is EMPTY');
    }

    return {
      status: 200,
      data: {
        userId: session?.user.id,
        healthAccountInfo: healthAccInfo,
        hraBean: hraBean,
        fsaBean: fsaBean,
        acctYearlyData: acctYearlyData,
        isApiError: false,
      },
    };
  } catch (error) {
    logger.error(
      'Error Response from Spending Accounts - MyHealthCareService',
      error,
    );
    return {
      status: 200,
      data: {
        userId: session?.user.id,
        healthAccountInfo: healthAccInfo,
        isApiError: true,
      },
    };
  }
}

async function mapSpendingAccBal(
  fsaBean: FSABean[],
  hraBean: HRABean,
): Promise<AccountYearlyData[]> {
  const acctYearlyData: AccountYearlyData[] = [];
  const defaultAmt = '$0.00';
  try {
    if (!isObjectEmpty(hraBean)) {
      logger.info('Mapping HRA Bean', hraBean);
      const hraAcctData: AccountYearlyData = {} as AccountYearlyData;
      hraAcctData.planYears = [
        new Date(getCurrentDate()).getFullYear().toString(),
      ];
      hraAcctData.accountTypeText = 'HRA';
      hraAcctData.spendingBalanceTitle = 'Health Reimbursement Account';
      hraAcctData.transactionsLabel = 'View HRA Transactions';
      hraAcctData.yearData = [
        {
          planYear: new Date(getCurrentDate()).getFullYear().toString(),
          contributionsAmount: hraBean?.totalHRAAmount || defaultAmt,
          distributionsAmount: hraBean?.totalExpenditures || defaultAmt,
          balanceAmount: hraBean?.currentBalance || defaultAmt,
        } as SpendingBalanceYearData,
      ];
      acctYearlyData.push(hraAcctData);
    }
  } catch (err) {
    logger.error('Error mapping HRA Bean', err);
  }
  try {
    logger.info('Mapping FSA Bean', fsaBean);
    if (fsaBean.length > 0) {
      const fsaTypes = groupFSABeansByInd(fsaBean);
      // Iterate over fsaTypes and create a spendBal for each entry
      Object.entries(fsaTypes).forEach(([key, fsaTypeBeans]) => {
        const fsaData: AccountYearlyData = {} as AccountYearlyData;
        fsaData.transactionsLabel = 'View FSA Transactions';
        // Set these values based on the string in the key
        fsaData.accountTypeText = key === 'C' ? 'DCFSA' : 'FSA';
        fsaData.spendingBalanceTitle =
          key === 'C'
            ? 'Dependent Care Flexible Spending Account'
            : 'Flexible Spending Account';

        // Set these values based on the value objects
        const yearData = mapFSABeansToSpendingBalanceBean(fsaTypeBeans);
        if (yearData.planYears.length > 0) {
          fsaData.planYears = yearData.planYears;
          fsaData.yearData = yearData.yearData;
          acctYearlyData.push(fsaData);
        }
      });
    }
  } catch (err) {
    logger.error('Error mapping FSA Bean', err);
  }
  logger.info('Mapped Spending Balance Bean Details: ', acctYearlyData);
  return acctYearlyData;
}

function groupFSABeansByInd(fsaBeans: FSABean[]): Record<string, FSABean[]> {
  const groupedFSA = fsaBeans.reduce(
    (acc, bean) => {
      const type = bean.fsaTypeInd || 'Unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(bean);
      return acc;
    },
    {} as Record<string, FSABean[]>,
  );

  return groupedFSA;
}
