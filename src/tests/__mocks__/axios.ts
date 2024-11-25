import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { mock } from 'jest-mock-extended';

export const mockedAxios = mock<AxiosInstance>();
const axios = jest.requireActual('axios');

export const AxiosError = axios.AxiosError;
mockedAxios.interceptors = {
  request: {
    ...mock<AxiosInterceptorManager<InternalAxiosRequestConfig<unknown>>>(),
    use: jest.fn(),
  },
  response: mock<AxiosInterceptorManager<AxiosResponse<unknown, unknown>>>(),
};
const axiosDefault = {
  create: jest.fn(() => mockedAxios),
  get: jest.fn(),
  post: jest.fn(),
  AxiosError: axios.AxiosErrors,
};
export default axiosDefault;
