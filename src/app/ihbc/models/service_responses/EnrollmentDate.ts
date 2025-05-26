import { ServiceError } from './ServiceError';

export interface EnrollmentDate {
	startDate: Date;
	endDate: Date;
	planEffectiveDate: Date;
	planTermDate: Date;
	effectiveDate: Date;
	serviceError?: ServiceError;
}