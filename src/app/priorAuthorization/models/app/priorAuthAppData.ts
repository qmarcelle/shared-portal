import { PriorAuthDetails } from '../../models/priorAuthDetails';

export interface PriorAuthData {
  priorAuthDetails: PriorAuthDetails[] | null;
  phoneNumber: string;
  authorizationType: 'blueCare' | 'standard';
}
