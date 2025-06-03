import { ServiceError } from "./ServiceError";

export interface Counties {
	countyList: string[];
	serviceError?: ServiceError;
}