import { Application } from '../Application';
import { ServiceError } from './ServiceError';

export interface Applications {
  applicationList: Application[];
  serviceError?: ServiceError;
}
