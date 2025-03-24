import SSORedirect from '@/app/sso/redirect/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
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
      entries: jest.fn(() => []),
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
  SSO_IMPL_MAP: new Map([['ElectronicPaymentBOA', 'ElectronicPaymentBOAImpl']]),
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};

describe('ElectronicPaymentBOA SSO', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        currentBalance: '200.00',
        currentStmtBalance: '150.00',
        paymentDue: '50.00',
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should route to ElectronicPaymentBOA SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('ElectronicPaymentBOA');
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
    await waitFor(
      () => {
        expect(localAxios.post).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_PING_REST_URL}/ext/ref/dropoff`,
          {
            acctno: '902218823',
            currbal: '200.00',
            currstmtbal: '150.00',
            firstname: 'CHRIS',
            lastname: 'HALL',
            pcsid: '',
            pkey: '',
            pmtduedt: '50.00',
            sig: ';',
            subject: '',
            ts: expect.anything(),
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
      },
      { timeout: 5000 },
    );
  });
  it('Should not route to ElectronicPaymentBOA SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('ElectronicPaymentBOA');
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
            acctno: '902218823',
            currbal: '200.00',
            currstmtbal: '150.00',
            firstname: 'CHRIS',
            lastname: 'HALL',
            pcsid: '',
            pkey: '',
            pmtduedt: '50.00',
            sig: ';',
            subject: '',
            ts: expect.anything(),
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
});
