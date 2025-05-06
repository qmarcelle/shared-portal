import { FilterDetails } from '@/models/filter_dropdown_details';
import { Metadata } from 'next';
import SpendingSummary from '.';
import { getInitialClaimsFilter } from './actions/getInitialFilter';

export const metadata: Metadata = {
  title: 'SpendingSummaryPage',
};

const SpendingSummaryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { type } = await searchParams;
  const filterItems = getInitialClaimsFilter();
  filterItems[0].value = [...(filterItems[0].value! as FilterDetails[])];
  if (type) {
    const filterVal = (filterItems[2].value as FilterDetails[]).find(
      (item) => item.value.toLowerCase() == type.toLowerCase(),
    );
    if (filterVal) {
      filterItems[2].selectedValue = filterVal;
    }
  }

  return <SpendingSummary filters={filterItems} />;
};

export default SpendingSummaryPage;
