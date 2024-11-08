export interface DropdownItem {
  type: 'input' | 'dropdown';
  label: string;
  value?: DropDownDetails[] | string;
  selectedValue?: DropDownDetails;
}

export interface DropDownDetails {
  label: string;
  value: string;
  id: string;
}
