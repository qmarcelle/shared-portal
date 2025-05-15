export interface ShareMyInfoDetails {
  label: string;
  shortLabel: string;
  value: string;
  id: string;
}

export interface ShareOutsideMemberPlanDetails {
  memberName: string;
  planDetails: string;
  subscriberId: string;
}

export interface SelectedAccountDetails {
  memberName: string;
  planDetails: string;
  subscriberId: string;
  enabled: boolean;
}
