export interface OtherInsurance {
  noOtherInsurance: boolean;
  coverageType: string;
  coverageTypeDesc?: string;
  companyName: string;
  companyId: string;
  companyPhone: string;
  policyIdNum: string;
  secondaryIdNum: string; //Either Member ID or "Claim or Plan ID" depending on form
  policyHolderFirstName: string;
  policyHolderLastName: string;
  policyHolderBirthDate: Date;
  policyProvidedBy?: string; //Does not seem like this is used.
  policyEffectiveDate: Date;
  policyTermDate: Date;
  courtOrdered?: boolean;
  dueToDisability?: boolean;
  dueToRenalDisease?: boolean;
  memberEmployed?: boolean;
  memberOver65?: boolean;
  medicarePolicyType?: string;
  injuryDate?: Date;
}
