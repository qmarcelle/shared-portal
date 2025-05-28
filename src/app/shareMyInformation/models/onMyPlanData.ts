export interface OnMyPlanData {
  memberName: string;
  DOB: string;
  isMinor: boolean;
  targetType?: string;
  performer?: string;
  requester?: string;
  requestees?: string[];
  policyBusinessIdentifier?: string;
  type?: string;
  effectiveOn?: string;
  expiresOn?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  implicit?: boolean;
  isAdult?: boolean | undefined;
  personRoleType?: string | undefined;
  isMatureMinorMember?: boolean | undefined;
  isMinorMember?: boolean | undefined;
}
