import SSORedirect from '@/app/sso/redirect/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';

process.env.NEXT_PUBLIC_PING_REST_URL = 'https://sso3.bcbst.com';
process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID = 'MbrXyzLmnLogin';
process.env.PROVIDER_DIRECTORY_PCP_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39& locale=en';
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
  SSO_IMPL_MAP: new Map([['ProvDir', 'ProviderDirectoryImpl']]),
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};
describe('ProviderDirectoryImpl SSO', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        networks: [{ networkType: 'FACILITY', networkName: 'ABC Hospital' }],
        listOfFlag: [
          { flagName: 'VITALS_COPAY_EX_IND', flagValue: '0.0' },
          { flagName: 'VITALS_DEDUCT_EX_IND', flagValue: '0.0' },
        ],
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should not route to ProviderDirectoryImpl SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('ProvDir');
    mockGet.mockReturnValueOnce('PCPSearchRedirect');
    mockEntries.mockReturnValueOnce([['isPCPSearchRedirect', 'true']]);
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
            copayexcludedoop: '0.0',
            currentprprid: '3118777',
            dedexcludedoop: '0.0',
            dob: '1959-08-06',
            firstname: 'CHRIS',
            groupnumber: '100000',
            lastname: 'HALL',
            memberid: '90221882300',
            network: 'ABC Hospital',
            planid: '',
            prefix: 'QMI',
            sanitas: 'N',
            subject: '90221882300',
            subscriberid: '90221882300',
            targetresource: process.env.PROVIDER_DIRECTORY_PCP_SSO_TARGET,
            telehealth: '',
            zipcode: '37402',
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
  it('Should route to ProviderDirectoryImpl SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('ProvDir');
    mockEntries.mockReturnValueOnce([['isPCPSearchRedirect', 'true']]);
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
          copayexcludedoop: '0.0',
          currentprprid: '3118777',
          dedexcludedoop: '0.0',
          dob: '1959-08-06',
          firstname: 'CHRIS',
          groupnumber: '100000',
          lastname: 'HALL',
          memberid: '90221882300',
          network: 'ABC Hospital',
          planid: '',
          prefix: 'QMI',
          sanitas: 'N',
          subject: '90221882300',
          subscriberid: '90221882300',
          targetresource: process.env.PROVIDER_DIRECTORY_PCP_SSO_TARGET,
          telehealth: '',
          zipcode: '37402',
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
