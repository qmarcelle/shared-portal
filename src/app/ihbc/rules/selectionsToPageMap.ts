import { InitialSelectionEnum } from '../models/InitialSelectionEnum';
import { NavPagesEnum } from '../models/NavPagesEnum';

function getNavPagesForSelection(
  selection: InitialSelectionEnum,
  isOpenEnrollment: boolean,
): NavPagesEnum[] {
  switch (selection) {
    case InitialSelectionEnum.addDeps:
      return [
        ...(!isOpenEnrollment ? [NavPagesEnum.sepPage] : []),
        NavPagesEnum.changeDeps,
        NavPagesEnum.medicalPlan,
        NavPagesEnum.dentalVisionPlan,
      ];
    case InitialSelectionEnum.changeMyBenefits:
      return [
        ...(!isOpenEnrollment ? [NavPagesEnum.sepPage] : []),
        NavPagesEnum.changeDeps,
        NavPagesEnum.medicalPlan,
        NavPagesEnum.dentalVisionPlan,
      ];
    case InitialSelectionEnum.terminatePolicy:
      return [NavPagesEnum.terminatePolicyPage];
    case InitialSelectionEnum.terminateDeps:
      return [NavPagesEnum.terminateDeps];
    case InitialSelectionEnum.changePersonalInfo:
      return [];
  }
}

export function getNavPagesForSelections(
  selections: InitialSelectionEnum[],
  isOpenEnrollment: boolean,
) {
  const initialPages = [
    NavPagesEnum.landingpage,
    NavPagesEnum.initialSelectionPage,
  ];
  const tailPages = [
    NavPagesEnum.summaryPage,
    NavPagesEnum.tnCSubmission,
    NavPagesEnum.confirmation,
  ];
  const computedPages = selections
    .map((item) => getNavPagesForSelection(item, isOpenEnrollment))
    .flat(1);

  const pages = [...initialPages, ...computedPages, ...tailPages];
  return [...new Set(pages)];
}
