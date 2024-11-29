import { FilterItem } from '@/models/filter_dropdown_details';

export const getInitialPriorAuthFilter = () => {
  const filters: FilterItem[] = [
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
          label: 'Last 30 days',
          value: '1',
          id: '1',
        },
        {
          label: 'Last 60 days',
          value: '2',
          id: '2',
        },
        {
          label: 'Last 90 days',
          value: '3',
          id: '3',
        },
        {
          label: 'Last 120 days',
          value: '4',
          id: '4',
        },
        {
          label: 'Last calender Years',
          value: '5',
          id: '5',
        },
        {
          label: 'Last two Years',
          value: '6',
          id: '6',
        },
      ],
      selectedValue: {
        label: 'Last two Years',
        value: '6',
        id: '6',
      },
    },
  ];

  return filters;
};
