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
  loggedInMemberRole?: string | null;
};
