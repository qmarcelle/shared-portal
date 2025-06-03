import { VisibilityRules } from '@/visibilityEngine/rules';

export interface RepresentativeData {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  fullAccess: boolean;
  memeck?: string;
  accessStatus?: AccessStatus;
  accessStatusIsPending?: boolean;
  requesteeFHRID?: string;
  requesteeUMPID?: string;
  inviteStatus?: InviteStatus | undefined;
  id?: string;
  effectiveOn?: string;
  expiresOn?: string;
  policyId?: string;
  firstName?: string;
  lastName?: string;
  isMatureMinor: boolean;
  createdAt: string;
}

export type RepresentativeViewDetails = {
  representativeData: RepresentativeData[] | null;
  visibilityRules?: VisibilityRules;
  isRepresentativeLoggedIn: boolean;
  isMatureMinor: boolean;
};

export enum InviteStatus {
  Pending = 'Pending',
}

export enum AccessStatus {
  NoAccess = 'No Access',
  FullAccess = 'Full Access',
  BasicAccess = 'Basic Access',
  Pending = 'Pending',
}

export interface InviteRegisterEmailResponse {
  isEmailSent: string;
}
