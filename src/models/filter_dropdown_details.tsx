export interface FilterItem {
  type: 'input' | 'dropdown';
  label: string;
  value?: FilterDetails[] | string;
  selectedValue?: FilterDetails;
  selectedInputValue?: string;
}

export interface FilterDetails {
  label: string;
  value: string;
  id: string;
}
