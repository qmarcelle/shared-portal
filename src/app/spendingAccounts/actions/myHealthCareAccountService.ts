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
  FSABean,
  HealthAccountInfo,
  HRABean,
  MyHealthCareResponseDTO,
  SpendingBalanceBean,
} from '../model/myHealthCareResponseDTO';
import { SpendingBalanceYearData } from '../model/spendingBalanceYearData';
import { getHRAInfo } from './bcbstinternal/getHRAInfo';
import { mapFSABeansToSpendingBalanceBean } from './bcbstinternal/mapFSABeansToSpendingBalanceBean';

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

export async function myHealthCareAccountService(
  accountInfo: HealthAccountInfo,
): Promise<ActionResponse<number, MyHealthCareResponseDTO>> {
  try {
    const session = await auth();
    const memberDetails: LoggedInMember = await getLoggedInMember(session);
    let healthAccInfo: HealthAccountInfo[] = [];
    if (accountInfo) {
      healthAccInfo = [
        {
          bankName: accountInfo.bankName,
          accountTypes: accountInfo.accountTypes,
          linkName:
            SPEND_ACC_BANK_MAP[accountInfo.bankName.toLowerCase()] || '',
          linkUrl: SPEND_ACC_SSO_MAP[accountInfo.bankName.toLowerCase()] || '',
        },
      ];
    }
    const hraBean: HRABean = {
      currentBalance: '',
      employerAllocation: '',
      totalExpenditures: '',
      incentiveBalance: '',
      totalHRAAmount: '',
    };
    const fsaBean: FSABean[] = [];
    fsaBean.push(...(await fetchFSAAccountDetails(memberDetails?.memeCk)));
    let spendingBalanceBean: SpendingBalanceBean[] = [];

    if (accountInfo?.accountTypes.includes('HRA')) {
      Object.assign(hraBean, await processHRAInfo(memberDetails?.memeCk));
    }

    if ((hraBean && !isObjectEmpty(hraBean)) || fsaBean.length > 0) {
      spendingBalanceBean = await mapSpendingAccBal(fsaBean, hraBean);
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
        spendingBalanceBean: spendingBalanceBean,
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
        userId: '',
        healthAccountInfo: [],
        isApiError: true,
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
    if (!isObjectEmpty(hraBean)) {
      logger.info('Mapping HRA Bean');
      const spendBal: SpendingBalanceBean = {} as SpendingBalanceBean;
      spendBal.planYears = [
        new Date(getCurrentDate()).getFullYear().toString(),
      ];
      spendBal.accountTypeText = 'HRA';
      spendBal.spendingBalanceTitle = 'Health Reimbursement Account';
      spendBal.transactionsLabel = 'View HRA Transactions';
      spendBal.yearData = [
        {
          planYear: new Date(getCurrentDate()).getFullYear().toString(),
          contributionsAmount: hraBean?.totalHRAAmount || defaultAmt,
          distributionsAmount: hraBean?.totalExpenditures || defaultAmt,
          balanceAmount: hraBean?.currentBalance || defaultAmt,
        } as SpendingBalanceYearData,
      ];
      spendingBalanceBean.push(spendBal);
    }
  } catch (err) {
    logger.error('Error mapping HRA Bean', err);
  }
  try {
    if (fsaBean.length > 0) {
      const fsaTypes = groupFSABeansByInd(fsaBean);
      // Iterate over fsaTypes and create a spendBal for each entry
      Object.entries(fsaTypes).forEach(([key, fsaTypeBeans]) => {
        const spendBal: SpendingBalanceBean = {} as SpendingBalanceBean;
        spendBal.transactionsLabel = 'View FSA Transactions';
        // Set these values based on the string in the key
        spendBal.accountTypeText = key === 'C' ? 'DCFSA' : 'FSA';
        spendBal.spendingBalanceTitle =
          key === 'C'
            ? 'Dependent Care Flexible Spending Account'
            : 'Flexible Spending Account';

        // Set these values based on the value objects
        const yearData = mapFSABeansToSpendingBalanceBean(fsaTypeBeans);
        spendBal.planYears = yearData.planYears;
        spendBal.yearData = yearData.yearData;
        spendingBalanceBean.push(spendBal);
      });
    }
  } catch (err) {
    logger.error('Error mapping FSA Bean', err);
  }

  return spendingBalanceBean;
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
