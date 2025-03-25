import { AxiosError } from 'axios';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node/api-resolver';
import request from 'supertest';
import { parse } from 'url';

export const createAxiosErrorForTest = ({
  errorObject,
  status = 400,
}: {
  errorObject: unknown;
  status?: number;
}) => {
  const axiosError = {
    response: {
      status,
      data: errorObject,
    },
  };
  Object.setPrototypeOf(axiosError, AxiosError.prototype);
  return axiosError;
};

export const testClient = (handler: NextApiHandler, bodyParser = true) => {
  return request.agent(
    createServer((req: IncomingMessage, res: ServerResponse) => {
      const { query } = parse(req.url || '', true); // Default to an empty string if `req.url` is undefined

      const customConfig = {
        api: {
          bodyParser,
        },
      };

      return apiResolver(
        req,
        res,
        query,
        Object.assign(handler, { config: customConfig }),
        {
          previewModeEncryptionKey: '',
          previewModeId: '',
          previewModeSigningKey: '',
        },
        false,
      );
    }),
  );
};
