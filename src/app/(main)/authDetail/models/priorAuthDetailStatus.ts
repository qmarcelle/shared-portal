import { ClaimStatus } from '@/app/(main)/authDetail/models/claim-status';
import { ClaimType } from '@/app/(main)/authDetail/models/claim-type';

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
