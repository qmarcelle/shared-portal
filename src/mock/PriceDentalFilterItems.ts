import { FilterItem } from '@/models/filter_dropdown_details';

export const PriceDentalFilterItems: FilterItem[] = [
  {
    type: 'dropdown',
    label: 'Dental Network',
    value: [
      {
        label: 'Choose Network',
        value: '1',
        id: '1',
      },
      {
        label: 'BlueCare Plus',
        value: '2',
        id: '2',
      },
      {
        label: 'BlueChoice (HMO)',
        value: '3',
        id: '3',
      },
      {
        label: 'In TN & border counties (DentalBlue)',
        value: '4',
        id: '4',
      },
      {
        label: 'Outside TN',
        value: '5',
        id: '5',
      },
    ],
    selectedValue: {
      label: 'Choose Network',
      value: '1',
      id: '1',
    },
  },
  {
    type: 'dropdown',
    label: 'Category',
    value: [
      {
        label: 'Select Category',
        value: '1',
        id: '1',
      },
      {
        label: 'Exams',
        value: '2',
        id: '2',
      },
      {
        label: 'Fluoride',
        value: '3',
        id: '3',
      },
      {
        label: 'Cleanings',
        value: '4',
        id: '4',
      },
      {
        label: 'X-rays',
        value: '5',
        id: '5',
      },
      {
        label: 'Sealants',
        value: '3',
        id: '3',
      },
      {
        label: 'Space Maintainer Bilateral',
        value: '6',
        id: '6',
      },
      {
        label: 'Fillings',
        value: '7',
        id: '7',
      },
      {
        label: 'Crowns and related services',
        value: '8',
        id: '8',
      },
      {
        label: 'Periodontal Surgery and related services ',
        value: '9',
        id: '9',
      },
      {
        label: 'Dentures and related services',
        value: '10',
        id: '10',
      },
      {
        label: 'Extractions-Simple and Surgical',
        value: '11',
        id: '11',
      },
      {
        label: 'Fixed Bridge',
        value: '12',
        id: '12',
      },
      {
        label: 'Endodontics',
        value: '13',
        id: '13',
      },
    ],
    selectedValue: {
      label: 'Select Category',
      value: '1',
      id: '1',
    },
  },
  {
    type: 'dropdown',
    label: 'Procedure',
    value: [
      {
        label: 'Select Procedure',
        value: '1',
        id: '1',
      },
      {
        label: 'Topical fluoride varnish',
        value: '2',
        id: '2',
      },
    ],
    selectedValue: {
      label: 'Select Procedure',
      value: '1',
      id: '1',
    },
  },
  { type: 'input', label: 'Zip Code', value: '' },
];
