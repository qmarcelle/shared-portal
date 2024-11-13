import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { PriorAuthorizationCardSection } from '../../../app/priorAuthorization/components/PriorAuthorizationCardSection';
// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));
const renderUI = () => {
  return render(
    <PriorAuthorizationCardSection
      sortBy={[
        {
          label: 'Date (Most Recent)',
          value: '43',
          id: '1',
        },
        {
          label: 'Status (Denied First)',
          value: '2',
          id: '2',
        },
      ]}
      onSelectedDateChange={() => {}}
      selectedDate={{
        label: 'Date (Most Recent)',
        value: '43',
        id: '1',
      }}
      claims={[
        {
          referenceId: 'ref123',
          memberName: 'Chris Hall',
          lastName: 'Stark',
          memberId: 'mem123',
          claimType: 'Medical',
          authorizationIndicator: 'AuthIndicator',
          referenceIndicator: 'RefIndicator',
          statusCode: 'StatusCode',
          claimStatus: 'Approved',
          issuer: 'Service Group Description',
          serviceGroupId: 'grp123',
          fromDate: '04/06/2022',
          toDate: '04/06/2022',
          priorAuthFlag: 'flase',
          getProviderReferredTo: {
            providerId: 'prv123',
            name: 'Anand Patel',
            city: 'Nashville',
            postalCode: '90265',
            state: 'Tennessee',
            streetAddress1: '10880',
            streetAddress2: 'Malibu Point',
            phoneNumber: '1234567890',
          },
          getProviderReferredBy: {
            providerId: 'prv123',
            name: 'Anand Patel',
            city: 'Nashville',
            postalCode: '90265',
            state: 'Tennessee',
            streetAddress1: '10880',
            streetAddress2: 'Malibu Point',
            phoneNumber: '1234567890',
          },
          getProviderFacilityId: {
            providerId: 'prv123',
            name: 'Ironman',
            city: 'Nashville',
            postalCode: '90265',
            state: 'Tennessee',
            streetAddress1: '10880',
            streetAddress2: 'Malibu Point',
            phoneNumber: '1234567890',
          },
        },
      ]}
    />,
  );
};

describe('PriorAuthorizationCardSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('Sort by:')).toBeVisible();
    screen.getAllByText('Date (Most Recent)');

    expect(screen.getByText('Service Group Description')).toBeVisible();
    expect(screen.getByText('Approved')).toBeVisible();
    screen.getAllByAltText(/medical/i);
    const dateMostRecentDropdown = screen.getByText('Date (Most Recent)');

    // changing the value of the dropdown
    fireEvent.click(dateMostRecentDropdown);

    // Assert that "Status (Denied First)" is now the selected value
    const selectedDeniedOption = screen.getByText('Status (Denied First)');
    fireEvent.click(selectedDeniedOption);
    expect(screen.getByText('Status (Denied First)')).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
