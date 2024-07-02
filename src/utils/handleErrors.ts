/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorCodeMessageMap } from '@/models/app/errorCodeMessageMap';
import { AxiosError } from 'axios';

export const handleErrors = (error: any) => {
  try {
    if (error instanceof AxiosError) {
      const errorCode = error.response?.data.data.errorCode;
      const errormessage: string = errorCodeMessageMap.get(errorCode)!;
      return errormessage;
    }
  } catch (err) {
    //logger.error(err)
    return null;
  }
};

export const handleErrorCode = (error: any) => {
  try {
    if (error instanceof AxiosError) {
      const errorCode = error.response?.data.data.errorCode;
      return errorCode;
    }
  } catch (err) {
    //logger.error(err)
    return null;
  }
};
