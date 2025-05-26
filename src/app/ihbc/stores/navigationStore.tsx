import { ReactNode } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import { NavPagesEnum } from '../models/NavPagesEnum';
import { DentalVisionPlanPage } from '../pages/BenefitsSelectionPage/DentalVisionPlan';
import { MedicalPlanPage } from '../pages/BenefitsSelectionPage/MedicalPlan';
import { ChangeDependentsPage } from '../pages/ChangeDependentsPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import InitialSelectionPage from '../pages/InitialSelectionPage';
import { LandingPage } from '../pages/LandingPage';
import SpecialEnrolmentPage from '../pages/SpecialEnrolmentPeriodsPage';
import { SummaryPage } from '../pages/SummaryPage';
import { TerminateDependentsPage } from '../pages/TerminateDependentsPage';
import { TerminatePolicyPage } from '../pages/TerminatePolicyPage';
import { TnCSubmissionPage } from '../pages/TnCSubmissionPage';

const availPages: Map<NavPagesEnum, ReactNode> = new Map([
  [NavPagesEnum.landingpage, <LandingPage key={0} />],
  [NavPagesEnum.initialSelectionPage, <InitialSelectionPage key={1} />],
  [NavPagesEnum.sepPage, <SpecialEnrolmentPage key={2} />],
  [NavPagesEnum.terminateDeps, <TerminateDependentsPage key={3} />],
  [NavPagesEnum.changeDeps, <ChangeDependentsPage key={4} />],
  [NavPagesEnum.dentalVisionPlan, <DentalVisionPlanPage key={5} />],
  [NavPagesEnum.medicalPlan, <MedicalPlanPage key={6} />],
  [NavPagesEnum.terminatePolicyPage, <TerminatePolicyPage key={7} />],
  [NavPagesEnum.summaryPage, <SummaryPage key={8} />],
  [NavPagesEnum.tnCSubmission, <TnCSubmissionPage key={9} />],
  [NavPagesEnum.confirmation, <ConfirmationPage key={10} />],
]);

type NavState = {
  allowedPages: NavPagesEnum[];
  currentPagePointer: number;
  droppedTo: NavPagesEnum | undefined;
};

type NavActions = {
  updateCurrentPagePointer: (val: number) => void;
  updateAllowedPages: (pages: NavPagesEnum[]) => void;
  getCurrentPage: () => ReactNode;
  goForward: () => void;
  goBackWard: () => void;
  gotoPage: (page: NavPagesEnum) => void;
  dropTo: (page: NavPagesEnum) => void;
  restart: () => void;
};

const initialState: NavState = {
  allowedPages: [
    NavPagesEnum.landingpage,
    NavPagesEnum.initialSelectionPage,
    NavPagesEnum.sepPage,
    NavPagesEnum.terminateDeps,
    NavPagesEnum.changeDeps,
    NavPagesEnum.medicalPlan,
    NavPagesEnum.dentalVisionPlan,
    NavPagesEnum.terminatePolicyPage,
    NavPagesEnum.summaryPage,
    NavPagesEnum.tnCSubmission,
  ],
  currentPagePointer: 0,
  droppedTo: undefined,
};

export const useNavigationStore = createWithEqualityFn<NavState & NavActions>(
  (set, get) => ({
    ...initialState,
    updateCurrentPagePointer: (val: number) => set({ currentPagePointer: val }),
    updateAllowedPages: (pages: NavPagesEnum[]) => set({ allowedPages: pages }),
    getCurrentPage: () => {
      const currentPage = get().allowedPages[get().currentPagePointer];
      return availPages.get(currentPage);
    },
    goForward: () => {
      const droppedTo = get().droppedTo;
      if (droppedTo) {
        get().gotoPage(NavPagesEnum.summaryPage);
        set({ droppedTo: undefined });
        return;
      }
      const pagePointer = get().currentPagePointer;
      get().updateCurrentPagePointer(pagePointer + 1);
    },
    goBackWard: () => {
      const pagePointer = get().currentPagePointer;
      get().updateCurrentPagePointer(pagePointer - 1);
    },
    dropTo: (page) => {
      const index = get().allowedPages.findIndex((item) => item == page);
      set({ currentPagePointer: index, droppedTo: page });
    },
    gotoPage: (page) => {
      const index = get().allowedPages.findIndex((item) => item == page);
      set({ currentPagePointer: index });
    },
    restart: () => {
      set({
        allowedPages: [
          NavPagesEnum.landingpage,
          NavPagesEnum.initialSelectionPage,
        ],
      });
      set({
        currentPagePointer: 0,
      });
    },
  }),
);
