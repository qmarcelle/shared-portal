
import { ServiceError } from './ServiceError';

export interface StringWrapper {
	serviceError: ServiceError;
	value: string;
}