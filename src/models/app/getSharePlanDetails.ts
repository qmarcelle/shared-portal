export interface ShareMyPlanDetails {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  requesteeFHRID: string;
  requesteeUMPID: string;
  memberCk: string;
  accessStatus: AccessStatus;
  accessStatusIsPending: boolean;
  isMatureMinor: boolean;
  isMinor: boolean;
  roleType: string;
  performer?: string;
  requester?: string;
  requestees?: string[];
  policyBusinessIdentifier?: string;
  type?: string;
  effectiveOn?: string;
  expiresOn?: string;
  firstName?: string;
  lastName?: string;
  implicit?: boolean;
  status?: string;
  isAdult?: boolean;
  isMatureMinorMember?: boolean | undefined;
  personRoleType?: string | undefined;
  isMinorMember?: boolean | undefined;
}

export interface ShareOutsideMyPlanDetails {
  memberName: string;
  DOB: string;
  accessStatus: AccessStatus;
}

export enum AccessStatus {
  NoAccess = 'No Access',
  FullAccess = 'Full Access',
  BasicAccess = 'Basic Access',
  Pending = 'Pending',
}

export type SharePlanInformationDetails = {
  memberData: ShareMyPlanDetails[] | null;
  isMatureMinorMember?: boolean | undefined;
  personRoleType?: string | undefined;
  isMinorMember?: boolean | undefined;
  loggedInMemberRole?: string | null;
  outsideMyPlanData: ShareOutsideMyPlanDetails[] | null;
};
