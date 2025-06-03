import { createWithEqualityFn } from 'zustand/traditional';
import { InitialSelectionEnum } from '../models/InitialSelectionEnum';
import { getAllowedInitialSelections } from '../rules/initialSelections';
import { getNavPagesForSelections } from '../rules/selectionsToPageMap';
import { useNavigationStore } from './navigationStore';
import { useIhbcMainStore } from './ihbcMainStore';

type InitialSelectionState = {
  allowedSelections: InitialSelectionEnum[];
  selections: InitialSelectionEnum[];
};

type InitialSelectionActions = {
  updateSelections: (val: InitialSelectionEnum) => void;
};

const initialState: InitialSelectionState = {
  allowedSelections: [
    InitialSelectionEnum.addDeps,
    InitialSelectionEnum.changeMyBenefits,
    InitialSelectionEnum.terminateDeps,
    InitialSelectionEnum.changePersonalInfo,
    InitialSelectionEnum.terminatePolicy,
  ],

  selections: [],
};

export const useInitialSelectionStore = createWithEqualityFn<
  InitialSelectionState & InitialSelectionActions
>((set, get) => ({
  ...initialState,
  updateSelections: (val) => {
    let selections = get().selections;
    if (selections.includes(val)) {
      selections = selections.filter((item) => item != val);
    } else {
      selections.push(val);
    }

    const allowedSelections = getAllowedInitialSelections(selections);
    const allowedPages = getNavPagesForSelections(selections, useIhbcMainStore.getState().isOEActive);

    set({
      allowedSelections,
      selections: [...selections],
    });

    useNavigationStore.getState().updateAllowedPages(allowedPages);
  },
}));
