import { getMemberDetails } from '@/actions/memberDetails';
import PriorAuthorizationPage from '@/app/priorAuthorization/page';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const result = await PriorAuthorizationPage();
  render(result);
};
describe('Prior Authorization', () => {
  test('Prior Authorization api', async () => {
    const memberDetails = await getMemberDetails();

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        memberPriorAuthDetails: {
          memberPriorAuthDetail: [
            {
              authorizationIndicator: 'Y',
              firstName: 'ANITA',
              fromDate: '10/07/2022',
              getProviderFacilityId: {},
              getProviderReferredBy: {
                city: 'Franklin',
                name: 'Looney, Colin G.',
                phoneNumber: '6157912630',
                postalCode: '37067',
                providerId: '6141160',
                state: 'TN',
                streetAddress1: '3000 Edward Curd Lane',
                streetAddress2: '',
              },
              getProviderReferredTo: {
                city: 'Franklin',
                name: 'Bone and Joint Institute of Tennessee Inc',
                phoneNumber: '6157912630',
                postalCode: '370675971',
                providerId: '6140433',
                state: 'TN',
                streetAddress1: '3000 Edward Curd Ln',
                streetAddress2: '',
              },
              lastName: 'HINSHAW',
              memberId: '155481401',
              referenceId: '408320126',
              referenceIndicator: 'N',
              serviceGroupDescription:
                'Durable Medical Equipment - Prosthetic/Orthotics',
              serviceGroupId: 'DMPO',
              statusCode: 'CO',
              statusDescription: 'Approved',
              toDate: '10/07/2022',
            },
            {
              authorizationIndicator: 'Y',
              firstName: 'ANITA',
              fromDate: '06/30/2023',
              getProviderFacilityId: {},
              getProviderReferredBy: {
                city: 'Franklin',
                name: 'Looney, Colin G.',
                phoneNumber: '6157912630',
                postalCode: '37067',
                providerId: '6141160',
                state: 'TN',
                streetAddress1: '3000 Edward Curd Lane',
                streetAddress2: '',
              },
              getProviderReferredTo: {
                city: 'Franklin',
                name: 'Williamson Medical Center',
                phoneNumber: '',
                postalCode: '370675909',
                providerId: '5251322',
                state: 'TN',
                streetAddress1: '4321 Carothers Parkway',
                streetAddress2: '',
              },
              lastName: 'HINSHAW',
              memberId: '155481401',
              referenceId: 'EM1361131',
              referenceIndicator: 'N',
              serviceGroupDescription:
                'Magnetic Resonance Imaging, Outpatient-HTI/PRE-AUTH',
              serviceGroupId: 'MROP',
              statusCode: 'CO',
              statusDescription: 'Approved',
              toDate: '08/29/2023',
            },
            {
              authorizationIndicator: 'N',
              firstName: 'ANITA',
              fromDate: '05/10/2023',
              getProviderFacilityId: {},
              getProviderReferredBy: {
                city: 'FRANKLIN',
                name: 'Hunter, Samuel F.',
                phoneNumber: '6157915470',
                postalCode: '370645430',
                providerId: '4046711',
                state: 'TN',
                streetAddress1: '101 Forrest Crossing Blvd Ste 103',
                streetAddress2: '',
              },
              getProviderReferredTo: {
                city: 'Murfreesboro',
                name: 'TwelveStone Medical Inc',
                phoneNumber: '8448930012',
                postalCode: '371291539',
                providerId: '4237458',
                state: 'TN',
                streetAddress1: '352 W Northfield Blvd Ste 3A',
                streetAddress2: '',
              },
              lastName: 'HINSHAW',
              memberId: '155481401',
              referenceId: 'MB2325112',
              referenceIndicator: 'Y',
              serviceGroupDescription: 'SPRX-Provider Administered-Authed',
              serviceGroupId: 'SPR4',
              statusCode: 'CO',
              statusDescription: 'Approved',
              toDate: '11/05/2023',
            },
          ],
        },
      },
    });
    setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/memberPriorAuthDetails?memberKey=${memberDetails.member_ck}&fromDate=12/06/2022&toDate=08/06/2023`,
      );
    });
  });

  test('prior Authorization api integration null scenario', async () => {
    const memberDetails = await getMemberDetails();
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/memberPriorAuthDetails?memberKey=${memberDetails.member_ck}&fromDate=12/06/2022&toDate=08/06/2023`,
      );
      expect(response).toBeNull;
      expect(
        screen.getAllByText(
          'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
        ).length,
      ).toBe(1);
    });
  });

  test('prior Authorization api integration 400 bad request scenario', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );

    await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/memberPriorAuthDetails?memberKey=${memberDetails.member_ck}&fromDate=12/06/2022&toDate=08/06/2023`,
      );
      expect(
        screen.getAllByText(
          'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
        ).length,
      ).toBe(1);
    });
  });

  test('prior Authorization api integration 500 bad request scenario', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );

    await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/memberPriorAuthDetails?memberKey=${memberDetails.member_ck}&fromDate=12/06/2022&toDate=08/06/2023`,
      );
      expect(
        screen.getAllByText(
          'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
        ).length,
      ).toBe(1);
    });
  });
});
