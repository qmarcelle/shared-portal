export interface Plan {
  planId: string;
  planType: string;
  planTypeDesc: string;
  planName: string;
  effectiveDate: string;
  termDate: string;
  coverageLevel: string;
  eligInd: boolean;
  showDetailsLink: boolean;
}

export interface EligibilityBean {
  asOfDate: string;
  plans: Plan[];
}
