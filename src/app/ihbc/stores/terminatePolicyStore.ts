import { createWithEqualityFn } from 'zustand/traditional';
import { TerminatePolicyEnum } from '../models/terminatePolicyEnum';
import { getAllowedterminatePolicySelections } from '../rules/terminatePolicySelection';

type TerminatePolicyState = {
  allowedSelections: TerminatePolicyEnum[];
  selections: TerminatePolicyEnum[];
};

type TerminatePolicyActions = {
  updateSelections: (val: TerminatePolicyEnum) => void;
};

const initialState: TerminatePolicyState = {
  allowedSelections: [
    TerminatePolicyEnum.terminatePrimaryApplicant,
    TerminatePolicyEnum.cancelDentalPolicy,
    TerminatePolicyEnum.cancelMedicalPolicy,
    TerminatePolicyEnum.cancelVisionPolicy,
  ],
  selections: [],
};

export const useTerminatePolicyStore = createWithEqualityFn<
  TerminatePolicyState & TerminatePolicyActions
>((set, get) => ({
  ...initialState,
  updateSelections: (val) => {
    let selections = get().selections;
    if (selections.includes(val)) {
      selections = selections.filter((item) => item != val);
    } else {
      selections.push(val);
    }

    const allowedSelections = getAllowedterminatePolicySelections(selections);

    set({
      allowedSelections,
      selections: [...selections],
    });
  },
}));
