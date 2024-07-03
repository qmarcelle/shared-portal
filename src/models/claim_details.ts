export interface ClaimDetails {
  id: string;
  claimType: 'Medical' | 'Pharmacy' | 'Dental' | 'Vision';
  issuer: string;
  memberName: string;
  serviceDate: string;
  claimTotal: string | null;
  claimStatus: string;
  totalBilled?: string | null;
  planPaid?: string | null;
  myShare?: string | null;
  claimsFlag?: boolean;
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claimInfo: any;
  ReferredBy?: string;
  ReferredTo?: string;
  priorAuthFlag?: boolean;
}
