import { VisibilityRules } from '@/visibilityEngine/rules';
import { Session } from 'next-auth';

/*Function determines which benefits a member is eligible for based on their session's visibility rules*/
export async function getMemberEligibleBenefits(session?: Session | null) {
  let eligibleBenefits: string = '';

  const vRules: VisibilityRules = session?.user?.vRules ?? {
    medical: false,
    dental: false,
    vision: false,
    showPharmacyTab: false,
  };

  // Build the eligibleBenefits string based on vRules
  if (vRules.medical) {
    eligibleBenefits += 'M';
  }
  if (vRules.dental) {
    eligibleBenefits += 'D';
  }
  if (vRules.vision) {
    eligibleBenefits += 'V';
  }
  if (vRules.showPharmacyTab) {
    eligibleBenefits += 'P';
  }

  return eligibleBenefits;
}
