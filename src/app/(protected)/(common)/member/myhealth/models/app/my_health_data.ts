import { PrimaryCareProviderDetails } from '@/app/(protected)/(common)/member/findcare/primaryCareOptions/model/api/primary_care_provider';
import { VisibilityRules } from '@/visibilityEngine/rules';

export interface MyHealthData {
  memberRewards: MemberRewards | null;
  primaryCareProvider: PrimaryCareProviderDetails | null;
  visibilityRules?: VisibilityRules;
}

export interface MemberRewards {
  totalAmountEarned: number;
  totalAmount: number;
  quarterlyMaxPoints: number;
  quarterlyPointsEarned: number;
  isSelfFunded: boolean;
  //To Do: Need to Revisit the logic once we get proper api response in phase 2.
  //quarter: 'Q1' | 'Q2' | 'Q3';
}

export enum Quarter {
  'Q1' = 'JAN - APR',
  'Q2' = 'MAY - AUG',
  'Q3' = 'SEP - DEC',
}
