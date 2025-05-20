import { PriorAuthType } from '@/app/priorAuthorization/models/priorAuthType';
import { AuthStatus } from '@/app/priorAuthorization/utils/authStatus';

export interface DashboardPriorAuthDetails {
  priorAuthType: PriorAuthType;
  priorAuthName: string;
  dateOfVisit: string;
  priorAuthStatus: AuthStatus;
  member: string;
  referenceId: string;
}
