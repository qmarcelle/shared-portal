// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BenefitDetailsBean {
  planId: string;
  productType: string;
  carveOutInfo: CarveOutInfo[];
  rateSchedule: RateSchedule[];
  networkTiers: NetWorksAndTierInfo[];
  serviceCategories: ServiceCategory[]; // Only used when not grouping by category (shows empty categories)
  coveredServices: CoveredService[]; // Contains categories w/ nested data when grouping, or service details when not grouping
}

interface CarveOutInfo {
  name: string;
  contactNumber: string;
  defaultText: string;
  carveOutLevel: string;
  classID: number;
}

interface RateSchedule {
  procedureCode: string;
  amount: number;
  effectiveDate: string;
  termDate: string;
  description: string;
  type: string;
}

interface NetWorksAndTierInfo {
  tierID: string;
  tierDesc: string;
  tierExplanation: string;
  netWorkInd: string;
  dispOrder: number;
}

interface ServiceCategory {
  id: number;
  category: string;
  comments: string;
  sortOrder?: number;
  displaySortOrder: number | null;
  services?: CoveredService[];
}

interface CoveredService {
  categoryId: number;
  description: string;
  tierCode: string;
  serviceTypeCode: string;
  copay: number;
  deductible: number;
  memberPays: number;
  comment?: string;
  displaySortOrder: number;
}
