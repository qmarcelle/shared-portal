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
  SSO_IMPL_MAP: new Map([['PremiseHealth', 'PremiseHealthImpl']]),
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};
describe('PremiseHealth SSO', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  it('Should not route to PremiseHealth SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('PremiseHealth');
    mockEntries.mockReturnValueOnce([['target', 'schedule']]);
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
            bpassmain: 'scheduler',
            dob: '08/06/1959',
            employeeid: '90221882300',
            firstname: 'CHRIS',
            groupnumber: '100000',
            lastname: 'HALL',
            subject: '902218823',
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
  it('Should route to PremiseHealth SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('PremiseHealth');
    mockEntries.mockReturnValueOnce([]);
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
          bpassmain: 'main',
          dob: '08/06/1959',
          employeeid: '90221882300',
          firstname: 'CHRIS',
          groupnumber: '100000',
          lastname: 'HALL',
          subject: '902218823',
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
