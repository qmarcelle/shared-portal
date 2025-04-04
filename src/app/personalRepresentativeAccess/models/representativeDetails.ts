import { VisibilityRules } from '@/visibilityEngine/rules';

export interface RepresentativeData {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  fullAccess: boolean;
  memeck?: string;
  requesteeFHRID?: string;
  inviteStatus?: InviteStatus | undefined;
}

export type RepresentativeViewDetails = {
  representativeData: RepresentativeData[] | null;
  visibilityRules?: VisibilityRules;
  isRepresentativeLoggedIn: boolean;
};

export enum InviteStatus {
  Pending = 'Pending',
}

export interface InviteRegisterEmailResponse {
  isEmailSent: string;
}
