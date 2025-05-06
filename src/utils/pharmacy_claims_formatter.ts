import { PharmacyClaim } from '@/app/(protected)/(common)/member/pharmacy/models/pharmacy_claim';

import { ClaimDetails } from '@/models/claim_details';
import { capitalizeString } from './string_format';

export function formatPharmacyClaims(
  pharmacyClaims: PharmacyClaim[],
): ClaimDetails[] {
  return pharmacyClaims.map((pharmClaim: PharmacyClaim) => {
    return {
      id: pharmClaim.claimId,
      claimStatus: capitalizeString(pharmClaim.status),
      claimType: 'Pharmacy',
      claimTotal: pharmClaim.prescription.billedAmount,
      issuer: pharmClaim.prescription.pharmacy.pharmacyName,
      memberName: `${pharmClaim.membership.patientFirstName} ${pharmClaim.membership.patientLastName}`,
      serviceDate: pharmClaim.dateOfService,
      claimInfo: {},
      isMiniCard: true,
      // callBack: () => {},
      memberId: pharmClaim.membership.subscriberId,
      claimStatusCode: 2,
    };
  });
}
