import { ServiceError } from "./ServiceError";

export interface CommissionId {
	commissionIdList: string[];
	serviceError?: ServiceError;
}