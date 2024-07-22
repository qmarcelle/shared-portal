import { AxiosInstance } from 'axios';
import { mock } from 'jest-mock-extended';

export const mockedAxios = mock<AxiosInstance>();
const axios = jest.requireActual('axios');

export const AxiosError = axios.AxiosError;
const axiosDefault = {
  create: jest.fn(() => mockedAxios),
  get: jest.fn(),
  AxiosError: axios.AxiosErrors,
};
export default axiosDefault;
