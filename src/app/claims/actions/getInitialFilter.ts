import { FilterItem } from '@/models/filter_dropdown_details';

export function getInitialClaimsFilter() {
  const filterItems: FilterItem[] = [
    {
      type: 'dropdown',
      label: 'Member',
      value: [
        {
          label: 'All Members',
          value: '0',
          id: '0',
        },
      ],
      selectedValue: {
        label: 'All Members',
        value: '0',
        id: '0',
      },
    },
    {
      type: 'dropdown',
      label: 'Claim Type',
      value: [
        {
          label: 'All Types',
          value: '0',
          id: '0',
        },
        {
          label: 'Medical',
          value: 'Medical',
          id: '2',
        },
        {
          label: 'Pharmacy',
          value: 'Pharmacy',
          id: '3',
        },
        {
          label: 'Dental',
          value: 'Dental',
          id: '4',
        },
        {
          label: 'Vision',
          value: 'Vision',
          id: '5',
        },
      ],
      selectedValue: { label: 'All Types', value: '0', id: '0' },
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
