import { FilterDetails, FilterItem } from '@/models/filter_dropdown_details';

export function getInitialClaimsFilter(
  members: FilterDetails[],
  claimTypes: FilterDetails[],
) {
  const filterItems: FilterItem[] = [
    {
      type: 'dropdown',
      label: 'Member',
      value: [...members],
      selectedValue: {
        label: members[0].label,
        value: members[0].value,
        id: members[0].id,
      }, // Will be set dynamically later
    },
    {
      type: 'dropdown',
      label: 'Claim Type',
      value: [...claimTypes],
      selectedValue: {
        label: claimTypes[0].label,
        value: claimTypes[0].value,
        id: claimTypes[0].id,
      },
    },
    {
      type: 'dropdown',
      label: 'Date Range',
      value: [
        {
          label: 'Last 30 Days',
          value: '1',
          id: '1',
        },
        {
          label: 'Last 60 Days',
          value: '2',
          id: '2',
        },
        {
          label: 'Last 90 Days',
          value: '3',
          id: '3',
        },
        {
          label: 'Last 120 Days',
          value: '4',
          id: '4',
        },
        {
          label: 'Last Calendar Year',
          value: '5',
          id: '5',
        },
        {
          label: 'Last Two Years',
          value: '6',
          id: '6',
        },
      ],
      selectedValue: {
        label: 'Last Two Years',
        value: '6',
        id: '6',
      },
    },
  ];

  return filterItems;
}
