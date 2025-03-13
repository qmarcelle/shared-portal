import { FilterDetails } from '@/models/filter_dropdown_details';
import { formatPharmacyClaims } from '@/utils/pharmacy_claims_formatter';
import ClaimsSnapshot from '.';
import { getPharmacyClaims } from '../pharmacy/actions/getPharmacyClaims';
import { getAllClaimsData } from './actions/getClaimsData';
import { getInitialClaimsFilter } from './actions/getInitialFilter';
import { ClaimsData } from './models/app/claimsData';

// eslint-disable-next-line @next/next/no-async-client-component
const MyClaimsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  try {
    const [result, pharmacyClaims] = await Promise.all([
      getAllClaimsData(),
      getPharmacyClaims(),
    ]);

    if (result.status !== 200 || pharmacyClaims.status !== 200) {
      throw new Error('Failed to fetch claims data');
    }

    const claimsData: ClaimsData = {
      claims: [
        ...(result?.data?.claims ?? []),
        ...formatPharmacyClaims(
          pharmacyClaims?.data!.pharmacyClaims.pharmacyClaim ?? [],
        ),
      ],
      members: result?.data?.members ?? [],
    };

    const claimTypes = Array.from(
      new Set(claimsData.claims?.map((claim) => claim.claimType) ?? []),
    ).map((claimType) => ({
      label: claimType,
      value: claimType,
      id: claimType,
    }));

    const { type } = await searchParams;
    const filterItems = getInitialClaimsFilter(claimTypes);
    filterItems[0].value = [
      ...(filterItems[0].value! as FilterDetails[]),
      ...(result?.data?.members ?? []),
    ];
    if (type) {
      const filterVal = (filterItems[1].value as FilterDetails[]).find(
        (item) => item.value.toLowerCase() == type.toLowerCase(),
      );
      if (filterVal) {
        filterItems[1].selectedValue = filterVal;
      }
    }
    const claims = claimsData.claims;

    return <ClaimsSnapshot claimsList={claims} filters={filterItems} />;
  } catch (error) {
    console.error('Error fetching claims data:', error);
    return <ClaimsSnapshot claimsList={undefined} filters={null} />;
  }
};

export default MyClaimsPage;
