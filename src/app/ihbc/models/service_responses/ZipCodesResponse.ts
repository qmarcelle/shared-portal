import { ServiceError } from "./ServiceError";

export interface ZipCodesResponse {
    zipcodeList: string[];
    serviceError?: ServiceError;
}