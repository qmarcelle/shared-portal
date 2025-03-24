import LaunchSSO from '@/app/sso/launch/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Agent } from 'http';

process.env.NEXT_PUBLIC_PING_DROP_OFF_URL =
  'https://dev-login.bcbst.com/saml20/idp/startsso?';
process.env.ES_API_APP_ID = 'a12bef567890';
process.env.DROP_OFF_POLICY_ID = 'abcdefgh';
process.env.DAVINCI_API_URL = 'https://orchestrate-api.pingone.com/v1';
process.env.PING_ONE_BASE_URL = 'https://auth.pingone.com/';
process.env.NEXT_PUBLIC_ENV_ID = '123456-789012-bbbb-3456';
process.env.NEXT_PUBLIC_PROXY = 'false';
process.env.NEXT_PUBLIC_DROP_OFF_IDP = 'M3P';
process.env.NEXT_PUBLIC_PINGONE_SSO_ENABLED = 'true';

// Mock window.open
const mockOpen = jest.fn();
global.open = mockOpen;
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

jest.mock('src/app/sso/ssoConstants', () => ({
  ...jest.requireActual('src/app/sso/ssoConstants'),
  SSO_IMPL_MAP: new Map([['M3P', 'M3PImpl']]),
}));

jest.mock('axios');
const localAxios = axios as jest.Mocked<typeof axios>;

jest.setTimeout(30000);

const setupUI = () => {
  render(<LaunchSSO />);
};

describe('M3P SSO', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should route to Error Page when we click SSO Link & SDKToken is failed', async () => {
    mockGet.mockReturnValueOnce('M3P');
    mockGet.mockReturnValueOnce('');
    localAxios.post.mockRejectedValueOnce({});
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(session);
    await setupUI();
    await waitFor(() => {
      expect(localAxios.post).toHaveBeenCalledWith(
        `${process.env.DAVINCI_API_URL}/company/${process.env.NEXT_PUBLIC_ENV_ID}/sdktoken`,
        {
          policyId: process.env.DROP_OFF_POLICY_ID,
        },
        {
          headers: {
            'X-SK-API-Key': process.env.ES_API_APP_ID,
            'Content-Type': 'application/json',
          },
          proxy: false,
          httpsAgent: expect.any(Agent),
        },
      );
      expect(mockOpen).not.toHaveBeenCalled();
    });
    expect(screen.getByText(/Sorry, something went wrong./i)).toBeVisible();
  });
  it('Should route to Error Page when we click SSO Link & Drop Off API is failed', async () => {
    mockGet.mockReturnValueOnce('M3P');
    mockGet.mockReturnValueOnce('');
    localAxios.post.mockResolvedValueOnce({
      data: { access_token: 'xyz-abc-test' },
    });
    localAxios.post.mockRejectedValueOnce({});
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(session);
    await setupUI();
    await waitFor(() => {
      expect(localAxios.post).toHaveBeenCalledWith(
        `${process.env.DAVINCI_API_URL}/company/${process.env.NEXT_PUBLIC_ENV_ID}/sdktoken`,
        {
          policyId: process.env.DROP_OFF_POLICY_ID,
        },
        {
          headers: {
            'X-SK-API-Key': process.env.ES_API_APP_ID,
            'Content-Type': 'application/json',
          },
          proxy: false,
          httpsAgent: expect.any(Agent),
        },
      );
      expect(localAxios.post).toHaveBeenCalledWith(
        `${process.env.PING_ONE_BASE_URL}${process.env.NEXT_PUBLIC_ENV_ID}/davinci/policy/${process.env.DROP_OFF_POLICY_ID}/start`,
        {
          customerid: 'HCF0314',
          firstname: 'CHRIS',
          lastname: 'HALL',
          memberidentification: '',
          subject: '',
          userid: '',
        },
        {
          headers: {
            Authorization: 'Bearer xyz-abc-test',
            'Content-Type': 'application/json',
          },
          proxy: false,
          httpsAgent: expect.any(Agent),
        },
      );
      expect(mockOpen).not.toHaveBeenCalled();
    });
    expect(screen.getByText(/Sorry, something went wrong./i)).toBeVisible();
  });
  it('Should route to M3P SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('M3P');
    mockGet.mockReturnValueOnce('');
    localAxios.post.mockResolvedValueOnce({
      data: { access_token: 'xyz-abc-test' },
    });
    localAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        additionalProperties: {
          challenge: 'abcdef_l12345',
        },
      },
    });
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(session);
    await setupUI();
    await waitFor(() => {
      expect(localAxios.post).toHaveBeenCalledWith(
        `${process.env.DAVINCI_API_URL}/company/${process.env.NEXT_PUBLIC_ENV_ID}/sdktoken`,
        {
          policyId: process.env.DROP_OFF_POLICY_ID,
        },
        {
          headers: {
            'X-SK-API-Key': process.env.ES_API_APP_ID,
            'Content-Type': 'application/json',
          },
          proxy: false,
          httpsAgent: expect.any(Agent),
        },
      );
      expect(localAxios.post).toHaveBeenCalledWith(
        `${process.env.PING_ONE_BASE_URL}${process.env.NEXT_PUBLIC_ENV_ID}/davinci/policy/${process.env.DROP_OFF_POLICY_ID}/start`,
        {
          customerid: 'HCF0314',
          firstname: 'CHRIS',
          lastname: 'HALL',
          memberidentification: '',
          subject: '',
          userid: '',
        },
        {
          headers: {
            Authorization: 'Bearer xyz-abc-test',
            'Content-Type': 'application/json',
          },
          proxy: false,
          httpsAgent: expect.any(Agent),
        },
      );
      expect(mockOpen).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_PING_DROP_OFF_URL}spEntityId=M3P&challenge=abcdef_l12345`,
        '_blank',
      );
    });
    expect(
      screen.getByText(
        /We’re about to send you off to our partner’s site, if you are not automatically redirected use the link below./i,
      ),
    ).toBeVisible();
  });
});
