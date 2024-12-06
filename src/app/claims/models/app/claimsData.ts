import { RichSelectItem } from '@/components/foundation/RichDropDown';
import { ClaimDetails } from '@/models/claim_details';

export type ClaimsData = {
  claims: ClaimDetails[];
  members: RichSelectItem[];
};
