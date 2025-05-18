import { PriorAuthStatus } from './priorAuthStatus';

export interface PriorAuthDetailsStatus {
  priorAuthDetailName: string;
  dateOfVisit: string;
  priorAuthDetailStatus: PriorAuthStatus;
  member: string;
  PriorAuthReferenceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authInfo: any;
  referredName: string;
}
