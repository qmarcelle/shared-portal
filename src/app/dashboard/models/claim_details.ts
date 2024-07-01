export interface ClaimDetails {
  id: string;
  claimType: "Medical" | "Pharmacy" | "Dental" | "Vision";
  issuer: string;
  memberName: string;
  serviceDate: string;
  claimTotal: string | null;
  claimStatus: string;
  totalBilled?: string | null;
  planPaid?: string | null;
  myShare?: string | null;
  claimsFlag?: boolean;
  claimInfo: any;
  ReferredBy?: string;
  ReferredTo?: string;
  priorAuthFlag?: boolean;
}
