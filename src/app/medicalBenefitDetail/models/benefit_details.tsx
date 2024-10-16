export interface BenefitDetails {
  benefitTitle?: string;
  copayOrCoinsurancse?: string;
}

export interface ListBenefitDetails {
  listBenefitDetails: BenefitDetails[];
  note?: string;
}
