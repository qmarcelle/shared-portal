import PriorAuthorizationPage from '@/app/priorAuthorization/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockedAxios } from '../_mocks_/axios';

const renderUI = async () => {
  const result = await PriorAuthorizationPage();
  return render(result);
};

describe('PriorAuth FilterSection', () => {
  it('should render the UI correctly', async () => {
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
    const { container } = await renderUI();
    expect(screen.getByText('Prior Authorization')).toBeVisible();
    // Check if elements are visible
    expect(screen.getByText('Filter Prior Authorizations')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('All Members')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();
    expect(screen.getByText('Last two Years')).toBeVisible();
    const dateRangeDropdown = screen.getByText('Last two Years');

    // changing the value of the dropdown
    fireEvent.click(dateRangeDropdown);

    // Assert that "Last 90 days" is now the selected value
    const selectedOption = screen.getByText('Last 90 days');
    fireEvent.click(selectedOption);
    expect(screen.getByText('Last 90 days')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
