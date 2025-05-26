import { TerminatePolicyEnum } from '../models/terminatePolicyEnum';

export function getAllowedterminatePolicySelections(
  selections: TerminatePolicyEnum[],
): TerminatePolicyEnum[] {
  const availSelections = getAvailableSelections();
  let unallowedSelections: TerminatePolicyEnum[] = [];
  selections.forEach((item) => {
    const unallowedSelectionsForItem =
      getNotAllowedterminatePolicySelections(item);
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
    TerminatePolicyEnum.terminatePrimaryApplicant,
    TerminatePolicyEnum.cancelDentalPolicy,
    TerminatePolicyEnum.cancelMedicalPolicy,
    TerminatePolicyEnum.cancelVisionPolicy,
  ];
}

function getNotAllowedterminatePolicySelections(
  selection: TerminatePolicyEnum,
): TerminatePolicyEnum[] {
  switch (selection) {
    case TerminatePolicyEnum.terminatePrimaryApplicant:
      return [
        TerminatePolicyEnum.cancelMedicalPolicy,
        TerminatePolicyEnum.cancelVisionPolicy,
        TerminatePolicyEnum.cancelDentalPolicy,
      ];

    case TerminatePolicyEnum.cancelDentalPolicy:
      return [TerminatePolicyEnum.terminatePrimaryApplicant];

    case TerminatePolicyEnum.cancelMedicalPolicy:
      return [TerminatePolicyEnum.terminatePrimaryApplicant];

    case TerminatePolicyEnum.cancelVisionPolicy:
      return [TerminatePolicyEnum.terminatePrimaryApplicant];

    case TerminatePolicyEnum.keepDentalVisionPolicy:
      return [
        TerminatePolicyEnum.terminatePrimaryApplicant,
        TerminatePolicyEnum.cancelVisionPolicy,
        TerminatePolicyEnum.cancelDentalPolicy,
      ];

    // case TerminatePolicyEnum.cancelDentalPolicy:
    //   return [];
    // default:
    //   return [];
  }
}
