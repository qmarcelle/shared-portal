import { PlanType } from '@/models/plan_type';

export interface SearchPharmacyClaimsResponse {
  pharmacyClaims: PharmacyClaimsResponse;
}

export interface PharmacyClaimsResponse {
  pharmacyClaim: PharmacyClaim[];
}

export interface PharmacyClaimsRequest {
  startDate: string;
  endDate: string;
}

export interface PharmacyClaim {
  sourceType: string;
  dateOfService: string;
  status: string;
  claimId: string;
  claimType: PlanType;
  membership: {
    subscriberId: string;
    patientFirstName: string;
    patientLastName: string;
  };
  prescription: {
    rxnumber: string;
    drug: {
      name: string;
      labelName: string;
      nationalDrugCode: string;
      genericCodeNumber: string;
      dosageForm: string;
      strength: string;
      brand: boolean;
    };
    quantity: string;
    daysSupply: string;
    refillsLeft: string;
    refillNumber: string;
    pharmacy: {
      providerNPI: string;
      ncpdpProviderId: string;
      pharmacyName: string;
    };
    billedAmount: string;
    amountPaidByMember: string;
    amountPaidByPlan: string;
    deductibleAmount: string;
    copayAmount: string;
    prescriberName: string;
  };
  id: string;
  issuer: string;
  memberId: string;
  memberName: string;
  serviceDate: string;
  claimTotal: null;
  claimStatus: string;
  claimStatusCode: number;
  claimInfo: undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: () => any;
}
