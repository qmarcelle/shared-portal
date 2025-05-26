import { ServiceError } from './ServiceError';

export interface Plans {
	plans: string[];
	serviceError: ServiceError;
}