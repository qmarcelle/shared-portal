import { ServiceError } from "./ServiceError";

export interface RegionCodes {
	regionCodeList: string[];
	serviceError?: ServiceError;
}