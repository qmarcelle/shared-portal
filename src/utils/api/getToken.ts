import { OAuth } from '@/models/enterprise/oAuth';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { logger } from '../logger';

export async function getAuthToken() {
  let token: undefined | string;
  const retry: number = 1;
  try {
    //Fetch Access Token & Expiry Time from Global Variable
    token = globalThis?.accessToken?.access_token;
    const expires = globalThis?.accessToken?.expires_at;
    const currentTime = new Date().getTime() / 1000;
    //If token is not available or token gets expired invoke the token api
    if (!token || (token && expires && currentTime >= expires)) {
      token = await invokePingToken(retry);
    }
  } catch (error) {
    logger.error('getToken' + error);
    if (error instanceof AxiosError) {
      logger.error(
        `PING Auth Token API - Status ${
          error.response?.status
        }, Response ${JSON.stringify(error.response?.data)}`,
      );
    }
  }
  return token;
}

export async function invokePingToken(retry: number) {
  let token: undefined | string;
  try {
    const params = new URLSearchParams();
    //Bind Client Credentials as URL Params
    params.append('client_id', process.env.PING_CLIENT_ID ?? '');
    params.append('client_secret', process.env.PING_CLIENT_SECRET ?? '');
    params.append('grant_type', 'password');
    params.append('username', process.env.PING_CLIENT_USERNAME ?? '');
    params.append('password', process.env.PING_CLIENT_PASSWORD ?? '');
    //Invoke PING Auth Token API
    const response: AxiosResponse<OAuth> = await axios.post(
      process.env.PING_TOKEN_URL ?? '',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        proxy:
          process.env.NEXT_PUBLIC_PROXY?.toLocaleLowerCase() === 'false'
            ? false
            : undefined,
      },
    );
    if (globalThis && response?.data) {
      //Calculate the Expiry time (Current Time + Token expires_in from api) in seconds
      globalThis.accessToken = response.data;
      globalThis.accessToken.expires_at =
        new Date().getTime() / 1000 + response.data.expires_in;
      token = globalThis.accessToken.access_token;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(
        `PING Auth Token API, Retry ${retry} - Status ${
          error.response?.status
        }, Response ${JSON.stringify(error.response?.data)}`,
      );
      //Retry the PING Token API if it get failed. In future retry count will vary based on error code
      if (retry <= 2) {
        retry = retry + 1;
        await invokePingToken(retry);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
  return token;
}
