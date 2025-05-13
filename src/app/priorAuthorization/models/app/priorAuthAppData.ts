import { PriorAuthDetails } from '../priorAuthDetails';

export interface PriorAuthData {
  priorAuthDetails: PriorAuthDetails | null;
  phoneNumber: string;
}
