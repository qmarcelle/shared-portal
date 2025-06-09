import { OtherInsurance } from './otherInsurance';

export interface UpdateOtherInsuranceRequest {
  applyToAll: boolean;
  noOtherInsurance: boolean;
  otherInsurance: OtherInsurance[];
  coverageTypes: string[];
}
