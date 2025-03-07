import { InsuranceData } from './insurance_data';

export interface OtherHealthInsuranceDetails {
  medicareBean?: InsuranceData;
  medicalBean?: InsuranceData;
  dentalBean?: InsuranceData;
  /* Add 4 extra Bean?s */
  medicareMedicalBean?: InsuranceData;
  medicareDentalBean?: InsuranceData;
  medicarePrescriptionDrugInfoBean?: InsuranceData;
  medicareWorkersCompensationClaimBean?: InsuranceData;
  medicareBlackLungBenefitsBean?: InsuranceData;
  medicareOtherThirdPartyLiabilityBean?: InsuranceData;

  memeCK?: string;
  insuranceType?: string;
  forAllDependents?: boolean;
  noOtherInsurance?: boolean;
  lastUpdated?: Date;

  memberName: any;
  dob: any;
}
