import { createWithEqualityFn } from 'zustand/traditional';
import { ChangeAddressTypeEnum } from '../models/ChangeAddressTypeEnum';
import { ChangePersonalInfoEnum } from '../models/ChangePersonalInfoEnum';

type PersonalInformationState = {
  selectedChangeItems: ChangePersonalInfoEnum[];
  selectedAddressChangeItems: ChangeAddressTypeEnum[];
};

type PersonalInformationActions = {
  updateSelectedChangeItems: (val: ChangePersonalInfoEnum) => void;
  updateSelectedAddressChangeItems: (val: ChangeAddressTypeEnum) => void;
};

const initialState: PersonalInformationState = {
  selectedAddressChangeItems: [],
  selectedChangeItems: [],
};

export const usePersonalInformationStore = createWithEqualityFn<
  PersonalInformationState & PersonalInformationActions
>((set, get) => ({
  ...initialState,
  updateSelectedChangeItems: (val) => {
    let selectedItems = get().selectedChangeItems;
    if (selectedItems.includes(val)) {
      selectedItems = selectedItems.filter((item) => item != val);
    } else {
      selectedItems.push(val);
    }

    set({
      selectedChangeItems: [...selectedItems],
    });
  },
  updateSelectedAddressChangeItems: (val) => {
    let selectedItems = get().selectedAddressChangeItems;
    if (selectedItems.includes(val)) {
      selectedItems = selectedItems.filter((item) => item != val);
    } else {
      selectedItems.push(val);
    }

    set({
      selectedAddressChangeItems: [...selectedItems],
    });
  },
}));
