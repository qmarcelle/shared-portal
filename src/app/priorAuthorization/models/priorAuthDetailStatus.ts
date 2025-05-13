import { ClaimType } from '@/app/priorAuthorization/models/claim-type';
import { ClaimStatus } from './claim-status';

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
