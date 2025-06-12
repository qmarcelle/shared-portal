import { ClaimDetails } from '@/models/claim_details';
import { Claim, ClaimDetailService } from '../api/claimsResponse';

export interface ClaimDetailsData {
  claim: Claim;
  claimInfo: ClaimDetails;
  claimDetailServices?: ClaimDetailService[];
}
