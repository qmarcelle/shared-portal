import { ClaimDetails } from '@/models/claim_details';
import { Claim } from '../api/claimsResponse';

export interface ClaimDetailsData {
  claim: Claim;
  claimInfo: ClaimDetails;
}
