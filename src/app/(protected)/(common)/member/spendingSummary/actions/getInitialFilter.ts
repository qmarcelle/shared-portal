import { FilterItem } from '@/models/filter_dropdown_details';

export function getInitialClaimsFilter() {
  const filterItems: FilterItem[] = [
    {
      type: 'dropdown',
      label: 'Member',
      value: [
        {
          label: 'All Members',
          value: '1',
          id: '1',
        },
        {
          label: 'Chris Hall',
          value: '2',
          id: '2',
        },
        {
          label: 'Madission Hall',
          value: '3',
          id: '3',
        },
        {
          label: 'Forest Hall',
          value: '4',
          id: '4',
        },
        {
          label: 'Telly Hall',
          value: '5',
          id: '5',
        },
        {
          label: 'Janie Hall',
          value: '6',
          id: '6',
        },
      ],
      selectedValue: {
        label: 'All Members',
        value: '1',
        id: '1',
      },
    },
    {
      type: 'dropdown',
      label: 'Date Range',
      value: [
        {
          label: '2023',
          value: '1',
          id: '1',
        },
        {
          label: '2022',
          value: '2',
          id: '2',
        },
        {
          label: '2021',
          value: '3',
          id: '3',
        },
      ],
      selectedValue: { label: '2023', value: '1', id: '1' },
    },
    {
      type: 'dropdown',
      label: 'Claim Type',
      value: [
        {
          label: 'All Types',
          value: '1',
          id: '1',
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
      selectedValue: { label: 'All Types', value: '1', id: '1' },
    },
  ];
  return filterItems;
}
