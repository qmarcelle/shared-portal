export interface InsuranceData {
  otherInsuranceCompanyName: string;
  otherInsurancePhoneNum: string;
  policyIdNum: string;
  policyHolderFirstName: string;
  policyHolderLastName: string;
  policyEffectiveDate: string;
  policyCancelDate: string;
  otherInsuranceCompanyCode: string;
  lastUpdated?: Date;
  noOtherInsurance: boolean;
}
