import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { isObject } from './object_utils';

export const ES_TRANSACTION_ID = 'ES-transactionId';
const FIELDS_TO_BE_MASKED = ['password', 'newPassword'];
/* eslint-disable @typescript-eslint/no-explicit-any */
class Logger {
  private sequence = 0;

  // Add a new method to log environment configuration
  logEnvironmentConfig() {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORTAL_SERVICES_URL: process.env.PORTAL_SERVICES_URL,
      MEMBERSERVICE_CONTEXT_ROOT: process.env.MEMBERSERVICE_CONTEXT_ROOT,
      ES_API_URL: process.env.ES_API_URL,
      ES_PORTAL_SVCS_API_URL: process.env.ES_PORTAL_SVCS_API_URL,
    };
    
    this.info('Current Environment Configuration:', envVars);
  }

  maskFields(data: any): string | undefined {
    if (typeof data === 'object') {
      for (const key in data) {
        if (FIELDS_TO_BE_MASKED.includes(key.toLowerCase())) {
          data[key] = '********';
        } else if (typeof data[key] === 'object') {
          this.maskFields(data[key]); // Recursive call for nested objects
        }
      }
    }
    return JSON.stringify(data) ?? undefined;
  }

  formatSuccessResponse(resp: AxiosResponse, userName?: string): string {
    let log: string = '';
    if (resp) {
      const esTransactionId = (resp.headers as AxiosHeaders)
        ?.get(ES_TRANSACTION_ID)
        ?.toString();
      const url = `${resp.config?.method} ${resp.config?.url ?? ''} ${resp.status?.toString()}`;
      const request = this.maskFields(JSON.parse(resp.config?.data));
      const response = this.maskFields(resp.data);
      log = `URL: ${url} UserId: ${userName} ES TRANSACTION ID: ${esTransactionId} ${request ? `Request: ${request}` : null} ${response ? `Response: ${response}` : null}`;
    }
    return log;
  }

  formatErrorResponse(err: AxiosError, userName?: string): string {
    let log: string = '';
    if (err) {
      const esTransactionId = (err.response?.headers as AxiosHeaders)
        .get(ES_TRANSACTION_ID)
        ?.toString();
      const url = `${err.config?.method} ${err.config?.url ?? ''} ${err.response?.status?.toString()}`;
      const request = isObject(err.config?.data)
        ? this.maskFields(JSON.parse(err.config?.data))
        : null;
      const response = isObject(err.response?.data)
        ? this.maskFields(err.response?.data)
        : null;
      log = `URL: ${url} UserId: ${userName} ES TRANSACTION ID: ${esTransactionId} ${request ? `Request: ${request}` : null} ${response ? `Response: ${response}` : null}`;
    }
    return log;
  }

  info(msg: string, ...info: any) {
    try {
      if ((info?.[0] as AxiosResponse)?.headers instanceof AxiosHeaders) {
        console.info(
          `[${new Date().toLocaleString()}] I Sequence-${
            this.sequence
          }-${msg}-${this.formatSuccessResponse(info[0], info[1])}`,
        );
      } else {
        console.info(
          `[${new Date().toLocaleString()}] I Sequence-${
            this.sequence
          }-${msg}-${JSON.stringify(info)}`,
        );
      }
      ++this.sequence;
    } catch (error) {
      console.error(
        `Logger Info ${JSON.stringify(error, Object.getOwnPropertyNames(error), 4)}`,
      );
    }
  }

  error(msg: string, ...err: any) {
    try {
      if (err?.[0] instanceof AxiosError) {
        console.error(
          `[${new Date().toLocaleString()}] E Sequence-${
            this.sequence
          }-${msg}-${this.formatErrorResponse(err[0], err[1])}`,
        );
      } else {
        console.error(
          `[${new Date().toLocaleString()}] E Sequence-${
            this.sequence
          }-${msg}-${JSON.stringify(err, Object.getOwnPropertyNames(err), 4)}`,
        );
      }
      ++this.sequence;
    } catch (error) {
      console.error(
        `Logger Error ${JSON.stringify(error, Object.getOwnPropertyNames(error), 4)}`,
      );
    }
  }

  warn(msg: string, ...err: any) {
    try {
      console.warn(
        `[${new Date().toLocaleString()}] E Sequence-${
          this.sequence
        }-${msg}-${JSON.stringify(err, Object.getOwnPropertyNames(err), 4)}`,
      );

      ++this.sequence;
    } catch (error) {
      console.error(
        `Logger Error ${JSON.stringify(error, Object.getOwnPropertyNames(error), 4)}`,
      );
    }
  }
}
export const logger = new Logger();
