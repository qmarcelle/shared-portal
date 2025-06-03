import { ServiceError } from "./ServiceError";

export interface BooleanWrapper {
	serviceError?: ServiceError;
	value: boolean;
}