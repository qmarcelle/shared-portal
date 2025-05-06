import { FilterDetails } from '@/models/filter_dropdown_details';
import SpendingSummary from '..';
import { getInitialClaimsFilter } from '../actions/getInitialFilter';
import { SpendingType } from '../models/SpendingType';

interface SpendingSummaryPageProps {
  spendingType: SpendingType;
}

export function SpendingSummaryPage({
  spendingType,
}: SpendingSummaryPageProps) {
  const filterItems = getInitialClaimsFilter();
  filterItems[0].value = [...(filterItems[0].value! as FilterDetails[])];

  const filterVal = (filterItems[2].value as FilterDetails[]).find(
    (item: FilterDetails): boolean =>
      item.value.toLowerCase() === spendingType.toLowerCase(),
  );

  if (filterVal) {
    filterItems[2].selectedValue = filterVal;
  }

  return <SpendingSummary filters={filterItems} />;
}
