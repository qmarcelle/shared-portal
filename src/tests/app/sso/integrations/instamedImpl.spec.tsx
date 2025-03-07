import SSORedirect from '@/app/sso/redirect/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';

process.env.NEXT_PUBLIC_PING_REST_URL = 'https://sso3.bcbst.com';
process.env.NEXT_PUBLIC_PING_REST_INSTANCE_ID = 'MbrXyzLmnLogin';
process.env.INSTAMED_SSO_TARGET =
  'https://pay-uat.instamedtest.com/Form/Click2Pay/NewPayment';
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
  SSO_IMPL_MAP: new Map([['Instamed', 'InstamedImpl']]),
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<SSORedirect />);
};
describe('Instamed SSO', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        claim: {
          claimBenefitAmt: 0,
          claimCOBAmt: 0,
          claimCoInsAmt: 0,
          claimCopayAmt: 0,
          claimDeductibleAmt: 0,
          claimHRAIndicator: 'N',
          claimHighServiceDate: 1725336000000,
          claimId: 'EXT820200100',
          relatedClaimId: '',
          claimIdAdjustedFrom: '',
          claimIdAdjustedTo: '',
          claimIdCreatedFrom: '',
          claimLowServiceDate: 1725336000000,
          claimNonCoveredAmt: 0,
          networkSavings: 0,
          claimPaidAmt: 0,
          claimPaidDate: 1728878400000,
          claimPatientOweAmt: 0,
          claimRecievedDate: 1725508800000,
          claimStatusCode: '02',
          claimStatusDescription: 'Completed',
          claimSubType: 'M',
          claimTotalChargeAmt: 0,
          claimType: 'M',
          hraClaimPaidAmount: 0,
          bcbstPaysYou: 0,
          memberCk: 877944401,
          providerId: '4165326',
          providerName: 'Bhushan, Susan D.',
          providerSpecialty: 'INTM',
          cryptedKeyForEOB:
            'wyyTBm2LiQn4Z7FJZy%2F%2FT%2BTersIabnTMgY62pHR0eHJeqBxqIDd%2FxsUWFYu1in%2FLqrXwR2tGI%2Fni1%2FjiW4s6UiHlVJ5zRqytKpn%2FD9LjO%2BI%3D',
          networkID: '',
          networkSummary: '',
          tierDescription: '',
          tierId: '',
          tierPrefix: '',
          accountNumber: 0,
          totalAllowedAmt: 164.08,
          providerBillingTIN: '621508884',
          payToProviderAddress1: 'PO Box 1030',
          payToProviderCity: 'Chattanooga',
          payToProviderState: 'TN',
          payToProviderZip: '374011030',
          patientAccNo: '6474367',
          vndAmtPaid: 0,
          providerType: 'ITA1',
          eobInd: '',
          memberSuffix: 0,
          claimHighServiceCalendarDate: '09-03-2024',
          claimLowServiceCalendarDate: '09-03-2024',
          claimPaidCalendarDate: '10-14-2024',
          claimReceivedCalendarDate: '09-05-2024',
          bcbstpaysYou: 0,
        },
      },
    });
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Should not route to Instamed SSO when drop off service is failing', async () => {
    mockGet.mockReturnValueOnce('Instamed');
    mockEntries.mockReturnValueOnce([
      ['claimId', 'EXT820200100'],
      ['claimType', 'M'],
    ]);
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
            amountdue: '0.00',
            cancelurl: '',
            claimnumber: 'EXT820200100',
            claimreferencenumber: 'EXT820200100',
            confirmurl: '',
            dependentsequencenumber: '00',
            groupnumber: '100000',
            patientfirstname: 'CHRISTOCLAIM',
            patientid: '6474367',
            patientlastname: 'HALL',
            patientservicebegindate: '09/03/2024',
            patientserviceenddate: '09/03/2024',
            paytoprovideraddress1: 'PO Box 1030',
            paytoprovidercity: 'Chattanooga',
            paytoprovidername: 'Bhushan, Susan D.',
            paytoproviderstate: 'TN',
            paytoproviderzip: '374011030',
            policynumber: '902218823',
            providerbillingtin: '621508884',
            renderingprovidername: 'Bhushan, Susan D.',
            subject: '',
            targetresource:
              'https://pay-uat.instamedtest.com/Form/Click2Pay/NewPayment',
            userid: '',
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
  it('Should route to Instamed SSO when we click SSO Link', async () => {
    mockGet.mockReturnValueOnce('Instamed');
    mockEntries.mockReturnValueOnce([
      ['claimId', 'EXT820200100'],
      ['claimType', 'M'],
    ]);
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
          amountdue: '0.00',
          cancelurl: '',
          claimnumber: 'EXT820200100',
          claimreferencenumber: 'EXT820200100',
          confirmurl: '',
          dependentsequencenumber: '00',
          groupnumber: '100000',
          patientfirstname: 'CHRISTOCLAIM',
          patientid: '6474367',
          patientlastname: 'HALL',
          patientservicebegindate: '09/03/2024',
          patientserviceenddate: '09/03/2024',
          paytoprovideraddress1: 'PO Box 1030',
          paytoprovidercity: 'Chattanooga',
          paytoprovidername: 'Bhushan, Susan D.',
          paytoproviderstate: 'TN',
          paytoproviderzip: '374011030',
          policynumber: '902218823',
          providerbillingtin: '621508884',
          renderingprovidername: 'Bhushan, Susan D.',
          subject: '',
          targetresource:
            'https://pay-uat.instamedtest.com/Form/Click2Pay/NewPayment',
          userid: '',
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
