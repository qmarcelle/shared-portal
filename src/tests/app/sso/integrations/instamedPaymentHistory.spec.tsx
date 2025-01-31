import SSORedirect from '@/app/sso/redirect/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';

process.env.NEXT_PUBLIC_PING_REST_URL = 'https://sso3.bcbst.com';
process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID = 'MbrXyzLmnLogin';
const mockPush = jest.fn();
const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams() {
    return {
      get: mockGet,
    };
  },
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
        },
      },
    }),
  ),
}));

jest.mock('src/app/sso/ssoConstants', () => ({
  ...jest.requireActual('src/app/sso/ssoConstants'),
  SSO_IMPL_MAP: new Map([
    ['InstamedPaymentHistory', 'InstamedPaymentHistoryImpl'],
  ]),
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};
describe('InstamedPaymentHistory SSO', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('Should not route to InstamedPaymentHistory SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('InstamedPaymentHistory');
    mockGet.mockReturnValueOnce('');
    mockedAxios.post.mockRejectedValueOnce({});
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_PING_REST_URL}/ext/ref/dropoff`,
        {
          cancelurl: '',
          confirmurl: '',
          dependentsequencenumber: '00',
          groupnumber: '100000',
          policynumber: '902218823',
          userid: '',
          subject: '',
          targetresource: '',
          username: '',
        },
        {
          headers: {
            'ping.instanceId': process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID,
            Authorization: expect.anything(),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
  it('Should route to InstamedPaymentHistory SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('InstamedPaymentHistory');
    mockGet.mockReturnValueOnce('');
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        REF: 'abcdef_l12345',
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_PING_REST_URL}/ext/ref/dropoff`,
        {
          cancelurl: '',
          confirmurl: '',
          dependentsequencenumber: '00',
          groupnumber: '100000',
          policynumber: '902218823',
          userid: '',
          subject: '',
          targetresource: '',
          username: '',
        },
        {
          headers: {
            'ping.instanceId': process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID,
            Authorization: expect.anything(),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(mockPush).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_PING_REST_URL}?REF=abcdef_l12345`,
      );
    });
  });
});
