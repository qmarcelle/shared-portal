import { ESDetails } from './esDetails';

export interface ESResponse<T> {
  data?: T;
  details?: ESDetails;
  errorCode?: string;
}

export interface ESResponseValidation {
  details?: ESDetails;
  errorCode?: string;
}
