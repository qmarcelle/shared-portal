export interface FilterDropDowndetails {
  dropNownName: string;
  dropDownval: FilterDetails[];
  selectedValue: FilterDetails;
}

export interface FilterDetails {
  label: string;
  value: string;
  id: string;
}
