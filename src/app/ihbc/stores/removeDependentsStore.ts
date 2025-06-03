import { createWithEqualityFn } from 'zustand/traditional';

type RemoveDependentsState = {
  removeSpouse: boolean;
  removeDependents: boolean;
};

type RemoveDependentsActions = {
  toggleRemoveSpouse: () => void;
  toggleRemoveDependents: () => void;
};

const initialState: RemoveDependentsState = {
  removeDependents: false,
  removeSpouse: false,
};

export const useRemoveDependentsStore = createWithEqualityFn<
  RemoveDependentsState & RemoveDependentsActions
>((set, get) => ({
  ...initialState,
  toggleRemoveSpouse: () => {
    set({
      removeSpouse: !get().removeSpouse,
    });
  },
  toggleRemoveDependents: () => {
    set({
      removeDependents: !get().removeDependents,
    });
  },
}));
