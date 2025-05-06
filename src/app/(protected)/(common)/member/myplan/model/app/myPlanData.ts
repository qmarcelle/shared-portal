import { Address } from '@/models/member/api/loggedInUserInfo';
import { VisibilityRules } from '@/visibilityEngine/rules';

export type PlanDetail = {
  productCategory: string;
  planID: string;
  effectiveDate: number;
  planStartDate: number;
  planClassID: string;
  networkPlanName: string;
  isMedical: boolean;
  isDental: boolean;
  isVision: boolean;
  isSupplemental: boolean;
};

export type MyPlanData = {
  idCardSvgFrontData: string | null;
  planType: string | null;
  visibilityRules?: VisibilityRules;
};

export type AllMyPlanData = {
  memberName: string;
  dob: string;
  planDetails: PlanDetail[];
  medicalEffectiveDate: string;
  dentalEffectiveDate: string;
  visionEffectiveDate: string;
  address: Address[];
  primaryPhoneNumber: string;
};
