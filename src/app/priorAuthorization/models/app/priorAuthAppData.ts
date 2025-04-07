import { ClaimDetails } from '@/models/claim_details';

export interface PriorAuthData {
  claimDetails: ClaimDetails | null;
  phoneNumber: string;
}
