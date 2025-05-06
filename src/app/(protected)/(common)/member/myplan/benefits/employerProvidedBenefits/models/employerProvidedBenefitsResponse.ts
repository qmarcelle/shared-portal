export type EmployerProvidedBenefitsResponse = {
  benefitSumInfo: BenefitSumInfo[];
};

export type BenefitSumInfo = {
  tiered: boolean;
  carveOutInfo?: CarveOutInfo[];
  netWorksAndTierInfo: any[];
  listOfServices: any[];
};

export type CarveOutInfo = {
  name: string;
  contactNumber?: string;
  defaultText: string;
};
