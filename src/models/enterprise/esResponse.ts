import { ESDetails } from './esDetails';

export interface ESResponse<T> {
  data?: T;
  details?: ESDetails;
  errorCode?: string;
}
