import { InitialSelectionEnum } from '../models/InitialSelectionEnum';

export function getAllowedInitialSelections(
  selections: InitialSelectionEnum[],
): InitialSelectionEnum[] {
  const availSelections = getAvailableSelections();
  let unallowedSelections: InitialSelectionEnum[] = [];
  selections.forEach((item) => {
    const unallowedSelectionsForItem = getNotAllowedInitialSelections(item);
    unallowedSelections = [
      ...unallowedSelections,
      ...unallowedSelectionsForItem,
    ];
  });
  unallowedSelections = [...new Set(unallowedSelections)];
  return availSelections.filter((item) => !unallowedSelections.includes(item));
}

export function getAvailableSelections() {
  return [
    InitialSelectionEnum.addDeps,
    InitialSelectionEnum.changeMyBenefits,
    InitialSelectionEnum.terminateDeps,
    InitialSelectionEnum.changePersonalInfo,
    InitialSelectionEnum.terminatePolicy,
  ];
}

function getNotAllowedInitialSelections(
  selection: InitialSelectionEnum,
): InitialSelectionEnum[] {
  switch (selection) {
    case InitialSelectionEnum.terminatePolicy:
      return [
        InitialSelectionEnum.addDeps,
        InitialSelectionEnum.terminateDeps,
        InitialSelectionEnum.changeMyBenefits,
      ];

    case InitialSelectionEnum.addDeps:
      return [
        InitialSelectionEnum.terminatePolicy,
        InitialSelectionEnum.terminateDeps,
      ];

    case InitialSelectionEnum.terminateDeps:
      return [
        InitialSelectionEnum.terminatePolicy,
        InitialSelectionEnum.addDeps,
      ];

    case InitialSelectionEnum.changeMyBenefits:
      return [InitialSelectionEnum.terminatePolicy];

    case InitialSelectionEnum.changePersonalInfo:
      return [];
  }
}
