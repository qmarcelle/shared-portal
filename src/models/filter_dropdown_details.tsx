export interface FilterItem {
  type: 'input' | 'dropdown';
  label: string;
  value?: FilterDetails[] | string;
  selectedValue?: FilterDetails;
  // onFilterChanged?: (selectedValue: string) => void;
}

export interface FilterDetails {
  label: string;
  value: string;
  id: string;
}
