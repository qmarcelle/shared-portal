export interface OtherPlanDetails {
  planName: string;
  subscriber: string;
  id: string;
  policies: string;
}

export type AccessOtherPlanDetails = {
  memberName: string;
  dob: string;
  otherPlanData: OtherPlanDetails[] | null;
  accessStatus?: string;
};
