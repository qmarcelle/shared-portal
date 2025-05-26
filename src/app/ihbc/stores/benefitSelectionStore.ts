import { LoggedInMember } from '@/models/app/loggedin_member';
import { createWithEqualityFn } from 'zustand/traditional';
import { getDentalVisionPlanList } from '../actions/getDentalVisionPlanList';
import { getMedicalPlans } from '../actions/getMedicalPlans';
import { getPlans } from '../actions/getPlans';
import getRegionCodeForCounty from '../actions/getRegionCodeForCounty';

import { MedicalPlanDetail } from '../models/service_responses/MedicalPlanDetail';
import {
  getMedicalPlanResponse,
  getSelectedPlan,
} from '../pages/BenefitsSelectionPage/MedicalPlanResponse';
import { getPlanRequest } from '../pages/BenefitsSelectionPage/PlanRequest';
import { IHBCSchema } from '../rules/schema';
import { useSpecialEnrolmentPeriodStore } from './specialEnrolmentPeriodStore';

type BenefitSelectionState = {
  medicalPlan: MedicalPlanDetail[];
  plans: MedicalPlanDetail[];
  currentDentalPlan: MedicalPlanDetail[];
  currentVisionPlan: MedicalPlanDetail[];
  dentalPlan: MedicalPlanDetail[];
  visionPlan: MedicalPlanDetail[];
  selectedMedicalPlan: MedicalPlanDetail | null;
  selectedDentalPlan: MedicalPlanDetail | null;
  selectedVisionPlan: MedicalPlanDetail | null;
};

type BenefitSelectionActions = {
  loadMedicalPlans: (
    county: string,
    dependents: NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>,
    existingDeps: NonNullable<
      NonNullable<IHBCSchema['addDeps']>['existingDeps']
    >,
    userInfoData: LoggedInMember,
  ) => void;
  loadAllDentalVisionPlans: (
    county: string,
    dependents: NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>,
    existingDeps: NonNullable<
      NonNullable<IHBCSchema['addDeps']>['existingDeps']
    >,
    userInfoData: LoggedInMember,
  ) => void;
  updateMedicalPlan: (val: MedicalPlanDetail) => void;
  updateDentalPlan: (val: MedicalPlanDetail) => void;
  updateVisionPlan: (val: MedicalPlanDetail) => void;
};

const initialState: BenefitSelectionState = {
  medicalPlan: [],
  plans: [], // current Medical Plan
  dentalPlan: [],
  visionPlan: [],
  currentDentalPlan: [],
  currentVisionPlan: [],
  selectedMedicalPlan: null,
  selectedDentalPlan: null,
  selectedVisionPlan: null,
};

function removeSelectedPlan(
  array: MedicalPlanDetail[],
  objectID: string,
): MedicalPlanDetail[] {
  return array.filter((obj) => obj.planId !== objectID);
}

export const useBenefitSelectionStore = createWithEqualityFn<
  BenefitSelectionState & BenefitSelectionActions
>((set, get) => ({
  ...initialState,
  loadMedicalPlans: async (
    county: string,
    dependents: NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>,
    existingDeps: NonNullable<
      NonNullable<IHBCSchema['addDeps']>['existingDeps']
    >,
    userInfoData: LoggedInMember,
  ) => {
    const selectedEffectiveDate =
      useSpecialEnrolmentPeriodStore.getState().selectedEffectiveDate!;
    const countyCode = await getRegionCodeForCounty(county);
    const PlansRequest = await getPlanRequest(
      county,
      countyCode,
      dependents,
      existingDeps,
      userInfoData,
      selectedEffectiveDate,
    );
    const eligDate = new Date(
      useSpecialEnrolmentPeriodStore.getState().selectedEffectiveDate!,
    );
    const medicalPlan = await getMedicalPlans(PlansRequest); //user plan
    const medicalPlanResponse = await getMedicalPlanResponse(medicalPlan!);
    const getPlan = await getPlans(userInfoData.subscriberId, 'M', eligDate);
    const selectedPlan = await getSelectedPlan(getPlan!, medicalPlanResponse);
    const updatedMedicalPlan = removeSelectedPlan(
      medicalPlanResponse,
      selectedPlan[0]?.planId,
    );

    set({
      plans: selectedPlan,
      selectedMedicalPlan: selectedPlan[0],
      medicalPlan: updatedMedicalPlan,
    });
  },
  loadAllDentalVisionPlans: async (
    county: string,
    dependents: NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>,
    existingDeps: NonNullable<
      NonNullable<IHBCSchema['addDeps']>['existingDeps']
    >,
    userInfoData: LoggedInMember,
  ) => {
    const selectedEffectiveDate =
      useSpecialEnrolmentPeriodStore.getState().selectedEffectiveDate!;
    const countyCode = await getRegionCodeForCounty(county);
    const plansRequest = await getPlanRequest(
      county,
      countyCode,
      dependents,
      existingDeps,
      userInfoData,
      selectedEffectiveDate,
    );
    const eligDate = new Date(
      useSpecialEnrolmentPeriodStore.getState().selectedEffectiveDate!,
    );
    const getPlan = await getDentalVisionPlanList(plansRequest);
    const getDentalPlan = await getPlans(
      userInfoData.subscriberId,
      'D',
      eligDate,
    );
    const selectedDentalPlan = await getSelectedPlan(
      getDentalPlan!,
      getPlan.dentalPlanList,
    );
    const updatedDentalPlan = removeSelectedPlan(
      getPlan.dentalPlanList,
      selectedDentalPlan[0]?.planId,
    );
    const getVisionPlan = await getPlans(
      userInfoData.subscriberId,
      'V',
      eligDate,
    );
    const selectedVisionPlan = await getSelectedPlan(
      getVisionPlan!,
      getPlan.visionPlanList,
    );
    const updatedVisionPlan = removeSelectedPlan(
      getPlan.visionPlanList,
      selectedVisionPlan[0]?.planId,
    );
    set({
      dentalPlan: updatedDentalPlan,
      visionPlan: updatedVisionPlan,
      selectedVisionPlan: selectedVisionPlan[0],
      selectedDentalPlan: selectedDentalPlan[0],
      currentVisionPlan: selectedVisionPlan,
      currentDentalPlan: selectedDentalPlan,
    });
  },
  updateMedicalPlan: async (val) => {
    set({
      selectedMedicalPlan: val,
    });
  },
  updateDentalPlan: async (val) => {
    set({
      selectedDentalPlan: val,
    });
  },
  updateVisionPlan: async (val) => {
    set({
      selectedVisionPlan: val,
    });
  },
}));
