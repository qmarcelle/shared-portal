import ClaimsDetailPage from '@/app/claims/[id]/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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

jest.mock('src/utils/encryption', () => ({
  decrypt: jest.fn(() => {
    return 'EXT820200100';
  }),
}));

describe('Claim Details', () => {
  it('should show the respective claim details', async () => {
    mockedAxios.get
      // LoggedIn User Info
      .mockResolvedValueOnce({
        data: loggedInUserInfoMockResp,
      })
      .mockResolvedValueOnce({
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
            claimPatientOweAmt: 100,
            claimRecievedDate: 1725508800000,
            claimStatusCode: '02',
            claimStatusDescription: 'Completed',
            claimSubType: 'M',
            claimTotalChargeAmt: 0,
            claimType: 'M',
            hraClaimPaidAmount: 0,
            bcbstPaysYou: 0,
            memberCk: 91722407,
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
    // Render the page
    const result = await ClaimsDetailPage({
      searchParams: { type: 'M' },
      params: {
        id: 'aW9pZ0F3V0lwZHlrbnBaeUVtaGk3QT09O2QwY2JmOWQ0ZWNiZjM0OWU=',
      },
    });
    const { container } = render(result);

    // Members Api was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
    // Claim Detail APi was called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberservice/api/v1/claims/654567656/EXT820200100/M',
    );
    expect(screen.getByText('Bhushan, Susan D.')).toBeVisible();
    expect(screen.getByText('EXT820200100')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
