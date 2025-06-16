import { auth } from '@/auth';
import { FilterDetails } from '@/models/filter_dropdown_details';
import { formatPharmacyClaims } from '@/utils/pharmacy_claims_formatter';
import ClaimsSnapshot from '.';
import { getPharmacyClaims } from '../pharmacy/actions/getPharmacyClaims';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import { getAllClaimsData } from './actions/getClaimsData';
import { getInitialClaimsFilter } from './actions/getInitialFilter';
import { characterToLabelMap, ClaimsData } from './models/app/claimsData';
import { getMemberEligibleBenefits } from './models/app/memberEligibleBenefits';

function getClaimTypeMapFromClaims(claims: ClaimsData['claims']): string {
  /**
   * This method extracts the first character of each claim type from the claims array,
   * removes duplicates, and returns them as a concatenated string.
   */
  return Array.from(
    new Set(claims?.map((claim) => claim.claimType[0]) ?? []),
  ).join('');
}

const MEMBER_FILTER_INDEX = 0;
const CLAIM_TYPE_FILTER_INDEX = 1;

// eslint-disable-next-line @next/next/no-async-client-component
const MyClaimsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const phoneNumber = await invokePhoneNumberAction();
  try {
    const session = await auth();
    const eligibleBenefits = await getMemberEligibleBenefits(session);

    const { type } = await searchParams;
    const [result, pharmacyClaims] = await Promise.all([
      getAllClaimsData(),
      getPharmacyClaims(),
    ]);

    if (result.status !== 200) {
      throw new Error('Failed to fetch claims data');
    }

    const pharmacyClaimsList =
      pharmacyClaims?.data?.pharmacyClaims?.pharmacyClaim ?? [];

    const claimsData: ClaimsData = {
      claims: [
        ...(result?.data?.claims ?? []),
        ...(pharmacyClaimsList.length > 0
          ? formatPharmacyClaims(pharmacyClaimsList)
          : []), // Skip formatPharmacyClaims if the list is empty
      ],
      members: result?.data?.members ?? [],
    };

    const claimsTypes = getClaimTypeMapFromClaims(claimsData.claims);

    const eligibleBenefitsAndClaimsTypes = eligibleBenefits + claimsTypes;

    // Extract unique characters from the combined string
    const eligibleClaimsTypes = Array.from(
      new Set(eligibleBenefitsAndClaimsTypes.split('')),
    );

    // Create a FilterDetails array of objects
    const memberItems: FilterDetails[] = (claimsData?.members ?? []).map(
      (member) => ({
        label: member.label,
        value: member.value,
        id: member.id,
      }),
    );

    // Create a FilterDetails array of objects
    const claimTypeItems: FilterDetails[] = eligibleClaimsTypes.map((char) => ({
      label: characterToLabelMap[char],
      value: characterToLabelMap[char],
      id: characterToLabelMap[char],
    }));

    const filterItems = getInitialClaimsFilter(memberItems, claimTypeItems);

    // Set the selectedValue to the first added member, if available
    if (claimsData?.members && claimsData.members.length > 0) {
      filterItems[MEMBER_FILTER_INDEX].selectedValue = claimsData?.members[0];
    } else {
      filterItems[MEMBER_FILTER_INDEX].selectedValue = undefined;
    }
    if (type) {
      const filterVal = (
        filterItems[CLAIM_TYPE_FILTER_INDEX].value as FilterDetails[]
      ).find((item) => item.value.toLowerCase() == type.toLowerCase());
      if (filterVal) {
        filterItems[CLAIM_TYPE_FILTER_INDEX].selectedValue = filterVal;
      }
    }
    const claims = claimsData.claims;

    return (
      <ClaimsSnapshot
        claimsList={claims}
        filters={filterItems}
        phone={phoneNumber}
      />
    );
  } catch (error) {
    console.error('Error fetching claims data:', error);
    return (
      <ClaimsSnapshot
        claimsList={undefined}
        filters={null}
        phone={phoneNumber}
      />
    );
  }
};

export default MyClaimsPage;
