import { ClaimStatus } from '@/app/(protected)/(common)/member/authDetail/models/claim-status';
import { ClaimType } from '@/app/(protected)/(common)/member/authDetail/models/claim-type';

export interface PriorAuthDetailsStatus {
  priorAuthDetailType: ClaimType;
  priorAuthDetailName: string;
  dateOfVisit: string;
  priorAuthDetailStatus: ClaimStatus;
  member: string;
  PriorAuthReferenceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authInfo: any;
  referredName: string;
}
