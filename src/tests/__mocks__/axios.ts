import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { mock } from 'jest-mock-extended';

export const mockedAxios = mock<AxiosInstance>();
const axios = jest.requireActual('axios');
mockedAxios.interceptors = {
  request: {
    ...mock<AxiosInterceptorManager<InternalAxiosRequestConfig<unknown>>>(),
    use: jest.fn(),
  },
  response: mock<AxiosInterceptorManager<AxiosResponse<unknown, unknown>>>(),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  create: jest.fn(() => mockedAxios),
  AxiosError: axios.AxiosError,
};

export const AxiosError = axios.AxiosError;
