import { PriorAuthType } from '@/app/priorAuthorization/models/priorAuthType';

export interface DashboardPriorAuthDetails {
  priorAuthType: PriorAuthType;
  priorAuthName: string;
  dateOfVisit: string;
  priorAuthStatus: string;
  member: string;
  referenceId: string;
}
