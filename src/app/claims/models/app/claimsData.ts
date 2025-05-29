// import { PharmacyClaim } from '@/app/pharmacy/models/pharmacy_claim';
import { RichSelectItem } from '@/components/foundation/RichDropDown';
import { ClaimDetails } from '@/models/claim_details';

export type ClaimsData = {
  claims?: ClaimDetails[];
  members?: RichSelectItem[];
  // pharmacyClaims?: PharmacyClaim[];
};

// Export the character-to-label map as a type
export const characterToLabelMap: Record<string, string> = {
  M: 'Medical',
  D: 'Dental',
  V: 'Vision',
  P: 'Pharmacy',
};
