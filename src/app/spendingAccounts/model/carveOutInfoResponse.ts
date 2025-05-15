export interface GetBenifitSummaryInfoResponse {
  benefitSumInfo?: BenefitSumInfo[];
}

export interface BenefitSumInfo {
  productId: string;
  productType: string;
  asOfDate: string;
  tiered: boolean;
  carveOutInfo?: CarveOutInfo[];
  netWorksAndTierInfo?: NetWorksAndTierInfo[];
  listOfServices?: ServiceSumInfo[];
}

interface CarveOutInfo {
  name: string;
  contactNumber: string;
  defaultText: string;
  carveOutLevel: string;
  classID: number;
}

interface NetWorksAndTierInfo {
  tierID: string;
  tierDesc: string;
  tierExplanation: string;
  netWorkInd: string;
  dispOrder: number;
}

interface ServiceSumInfo {
  summaryID: string;
  summaryDesc: string;
  hasCoPay: boolean;
  hasCoIns: boolean;
  hasAllowance: boolean;
  hasMaxBenAmt: boolean;
  dispOrder: number;
  listOfAccumAmts: ServAccumAmts[];
}

interface ServAccumAmts {
  tierID: string;
  bsdlPfx: string;
  bcbstPays: number;
  memberPays: number;
  copayAmount: number;
  allowance: string;
  maxBenAmount: number;
}
