import SSORedirect from '@/app/sso/redirect/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';

process.env.NEXT_PUBLIC_PING_REST_URL = 'https://sso3.bcbst.com';
process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID = 'MbrXyzLmnLogin';
const mockPush = jest.fn();
const mockGet = jest.fn();
const mockEntries = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams() {
    return {
      get: mockGet,
      entries: mockEntries,
    };
  },
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const session = {
  user: {
    currUsr: {
      plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

const localAxios = axios as jest.Mocked<typeof axios>;

jest.mock('src/app/sso/ssoConstants', () => ({
  ...jest.requireActual('src/app/sso/ssoConstants'),
  SSO_IMPL_MAP: new Map([['InstamedPaymentHistory', 'InstamedImpl']]),
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};
describe('InstamedPaymentHistory SSO', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should not route to InstamedPaymentHistory SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('InstamedPaymentHistory');
    mockEntries.mockReturnValueOnce([['isInstamedPaymentHistory', 'true']]);
    mockGet.mockReturnValueOnce('');
    localAxios.post.mockRejectedValueOnce({});
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(session);
    await setupUI();
    await waitFor(
      () => {
        expect(localAxios.post).toHaveBeenCalledWith(
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
      },
      { timeout: 5000 },
    );
  });
  it('Should route to InstamedPaymentHistory SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('InstamedPaymentHistory');
    mockEntries.mockReturnValueOnce([['isInstamedPaymentHistory', 'true']]);
    mockGet.mockReturnValueOnce('');
    localAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        REF: 'abcdef_l12345',
      },
    });
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(session);
    await setupUI();
    await waitFor(() => {
      expect(localAxios.post).toHaveBeenCalledWith(
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
