import { FilterDetails } from '@/models/filter_dropdown_details';
import { Metadata } from 'next';
import ClaimsSnapshot from '.';
import { getAllClaimsData } from './actions/getClaimsData';
import { getInitialClaimsFilter } from './actions/getInitialFilter';

export const metadata: Metadata = {
  title: 'My Claims',
};

const MyClaimsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const result = await getAllClaimsData();
  const { type } = await searchParams;
  const filterItems = getInitialClaimsFilter();
  filterItems[0].value = [
    ...(filterItems[0].value! as FilterDetails[]),
    ...(result.data?.members ?? []),
  ];
  if (type) {
    const filterVal = (filterItems[1].value as FilterDetails[]).find(
      (item) => item.value.toLowerCase() == type.toLowerCase(),
    );
    if (filterVal) {
      filterItems[1].selectedValue = filterVal;
    }
  }

  return (
    <ClaimsSnapshot claimsList={result.data?.claims} filters={filterItems} />
  );
};

export default MyClaimsPage;
