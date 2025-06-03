import { ServiceError } from './ServiceError';

export interface BenefitChangeResponse {
  applicationId: string;
  updated: boolean;
  serviceError?: ServiceError;
}
