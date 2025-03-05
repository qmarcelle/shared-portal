export interface InsuranceData {
  /* Medical and Dental Form  */
  //medicare: string;
  otherInsuranceCompanyName: string;
  otherInsurancePhoneNum: string;
  //emailId: string;
  policyIdNum: string;
  policyHolderFirstName: string;
  policyHolderLastName: string;
  //policyHolderBirthDate: string;
  //policyProvidedBy: string;
  policyEffectiveDate: string;
  policyCancelDate: string;
  //generalCoveragePartOfCourtOrder: string;
  otherInsuranceCompanyCode: string;

  /* Medicare Form */
  /*medicareInsuranceCompanyCode: string;
  medicareInsuranceCompanyName: string;
  medicareMember: string;
  medicareDuetoDisability: string;
  medicareDuetoRenalDisease: string;
  medicareDialysisDate: string;
  medicareMemberStillEmployed: string;
  medicareMemberEmploymentType: string;
  medicareMember65OrOlder: string;
  medicarePolicyPrimaryCoverage: string;
  certified: string;
  insuranceType: string;
  medicarePartA: string;
  medicarePartB: string;
  medicarePartD: string;
  medicareEffectiveDate: string; */

  noOtherInsurance: boolean;
}
