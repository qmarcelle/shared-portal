import axiosDefault, { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import { esApi } from '@/utils/api/esApi';

describe('Es API', () => {
  it('Es API Should not set token when token api is failure', async () => {
    process.env.ES_API_PING_CREDENTIALS = 'XXXXX';
    await esApi.get('/api/mfAuthentication/devices', {
      baseURL: 'https://xxxx',
      data: { userId: 'xxxx' },
    });
    const tokenError = createAxiosErrorForTest({
      errorObject: {
        data: {},
        details: {
          componentName: 'string',
          componentStatus: 'string',
          returnCode: 'MF-401',
          subSystemName: 'string',
          message: 'string',
          problemTypes: 'string',
        },
      },
    });
    axiosDefault.post.mockRejectedValue(tokenError);
    const mockRequestCallback = (
      mockedAxios.interceptors.request.use as jest.Mock
    ).mock.calls[0][0];
    const config = await mockRequestCallback({
      headers: {},
      data: { userId: 'xxxx' },
    });
    expect(config.data.credentials).toBeDefined();
    expect(config.headers.Authorization).toBeDefined();
  });
  it('Es API Should set the credentials & authorization for every request when token api is success', async () => {
    process.env.ES_API_PING_CREDENTIALS = 'XXXXX';
    await esApi.get('/api/mfAuthentication/devices', {
      baseURL: 'https://xxxx',
      data: { userId: 'xxxx' },
    });
    axiosDefault.post.mockReturnValue({
      data: { access_token: 'XXXXXXXXX', expires_in: '7199' },
    });
    const mockRequestCallback = (
      mockedAxios.interceptors.request.use as jest.Mock
    ).mock.calls[0][0];
    const config = await mockRequestCallback({
      headers: {},
      data: { userId: 'xxxx' },
    });
    expect(config.data.credentials).toBeDefined();
    expect(config.headers.Authorization).toBeDefined();
  });
});
