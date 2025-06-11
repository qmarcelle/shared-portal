import { FilterDetails } from '@/models/filter_dropdown_details';
import { format, startOfYear, subDays, subYears } from 'date-fns';

export enum DateFilterValues {
  Last30Days = '30D',
  Last60Days = '60D',
  Last90Days = '90D',
  Last120Days = '120D',
  LastCalendarYear = 'CY',
  LastTwoYears = 'L2Y',
}

interface DefaultDateFilter {
  type: 'dropdown' | 'input';
  label: string;
  value: FilterDetails[];
  selectedValue: FilterDetails;
}

export const defaultDateFilter: DefaultDateFilter = {
  type: 'dropdown',
  label: 'Date Range',
  value: [
    {
      label: 'Last 30 Days',
      value: DateFilterValues.Last30Days,
      id: '1',
    },
    {
      label: 'Last 60 Days',
      value: DateFilterValues.Last60Days,
      id: '2',
    },
    {
      label: 'Last 90 Days',
      value: DateFilterValues.Last90Days,
      id: '3',
    },
    {
      label: 'Last 120 Days',
      value: DateFilterValues.Last120Days,
      id: '4',
    },
    {
      label: 'Last Calender Year',
      value: DateFilterValues.LastCalendarYear,
      id: '5',
    },
    {
      label: 'Last Two Years',
      value: DateFilterValues.LastTwoYears,
      id: '6',
    },
  ],
  selectedValue: {
    label: 'Last 120 Days',
    value: DateFilterValues.Last120Days,
    id: '4',
  },
};

export function getDateRange(category: `${DateFilterValues}`) {
  const today = new Date();
  let fromDate, toDate;
  console.log('getDateRange', category);
  switch (category) {
    case DateFilterValues.Last30Days:
      fromDate = subDays(today, 30);
      toDate = today;
      break;
    case DateFilterValues.Last60Days:
      fromDate = subDays(today, 60);
      toDate = today;
      break;
    case DateFilterValues.Last90Days:
      fromDate = subDays(today, 90);
      toDate = today;
      break;
    case DateFilterValues.Last120Days:
      fromDate = subDays(today, 120);
      toDate = today;
      break;
    case DateFilterValues.LastCalendarYear:
      fromDate = startOfYear(today);
      toDate = today;
      break;
    case DateFilterValues.LastTwoYears:
      fromDate = subYears(today, 2);
      toDate = today;
      break;
    default:
      throw Error('Invalid date range');
  }
  return {
    fromDate: format(fromDate, 'MM/dd/yyyy'),
    toDate: format(toDate, 'MM/dd/yyyy'),
  };
}
