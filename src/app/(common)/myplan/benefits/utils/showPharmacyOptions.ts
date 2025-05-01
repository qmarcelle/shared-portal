import { PlanDetail } from '@/models/member/api/loggedInUserInfo';

export function showPharmacyOptions(
  grpId: string | undefined,
  planDetails: PlanDetail[],
) {
  //hide if grpId is in hidden groups
  if (grpId === undefined) {
    return false;
  }
  const hideGroups: string[] = process.env.HIDE_RX_GROUP_IDS?.split(',') || [];
  if (hideGroups.includes(grpId)) {
    return false;
  }
  const hidePlans: string[] = process.env.HIDE_RX_PLAN_IDS?.split(',') || [];
  if (planDetails.find((plan) => hidePlans.includes(plan.planID))) {
    return false;
  }
  return true;
}
