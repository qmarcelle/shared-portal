export interface MyHealthCareResponseDTO {
  userId?: string;
  hraBean?: HRABean;
  fsaBean?: FSABean[];
  spendingBalanceBean?: SpendingBalanceBean[];
  exflexSpndAccnt?: FSABalance;
  exHRAAccnt?: HRABalance;
  healthAccountInfo?: HealthAccountInfo[];
  isHealthEquity?: boolean;
  isApiError: boolean;
}

interface Balance {
  accountType: string;
  availableBalance: string;
  contributions: string;
  distribution: string;
  butions: string;
}

export interface HRABean {
  employerAllocation?: string;
  totalExpenditures?: string;
  currentBalance?: string;
  incentiveBalance?: string;
  totalHRAAmount?: string;
}

export interface FSABean {
  accountBalance?: string;
  effectiveDate?: string;
  termDate?: string;
  fsaTypeInd?: string;
  totalExpenditure?: string;
  totalPledgeAmount?: string;
}

export interface SpendingBalanceBean {
  planYear: string;
  contributionsAmount: string;
  distributionsAmount: string;
  balanceAmount: string;
  transactionsLabel: string;
  spendingBalanceTitle: string;
  accountTypeText: string;
}

export interface FSABalance extends Balance {
  ytdClaimsAllowed: string;
  carryOver: string;
  planYear: string;
  ytdClaimsDenied: string;
  ytdClaimsPaid: string;
  electionAmount: string;
  ytdClaims: string;
  ytdClaimsWaitingPayment: string;
}

export interface HRABalance extends Balance {
  planYear: string;
  electionAmount: string;
  ytdClaims: string;
  ytdClaimsAllowed: string;
  ytdClaimsDenied: string;
  ytdClaimsPaid: string;
  ytdClaimsWaitingPayment: string;
  carryOver: string;
}

export type HealthAccountInfo = {
  accountType: string;
  bankName: string;
  linkName: string;
  linkUrl: string;
};
