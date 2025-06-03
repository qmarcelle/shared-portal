import { PrimaryCareProvider } from '@/app/findcare/primaryCareOptions/components/PrimaryCareProvider';
import { PrimaryCareProviderDetails } from '@/app/findcare/primaryCareOptions/model/api/primary_care_provider';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (providerDetails: PrimaryCareProviderDetails | null) => {
  return render(
    <PrimaryCareProvider
      className="large-section"
      label="Primary Care Provider"
      providerDetails={providerDetails}
      linkLabel="View or Update Primary Care Provider"
      title="My Primary Care Provider"
    />,
  );
};
process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY =
  'https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml';
process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39& locale=en';

describe('Primary Care Provider', () => {
  const baseUrl = window.location.origin;
  it('should render the UI correctly', async () => {
    const providerDetails = {
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
    };
    const component = renderUI(providerDetails);
    screen.getByText('Louthan, James D.');
    screen.getByText('Primary Care Provider');
    screen.getByText('2033 Meadowview Ln Ste 200');
    screen.getByText('Kingsport TN 37660-7432');
    screen.getByText('(423) 857-2260');
    screen.getByText('View or Update Primary Care Provider');
    screen.getByText('My Primary Care Provider');

    expect(
      screen.getByRole('link', {
        name: 'View or Update Primary Care Provider',
      }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&alternateText=Find a PCP&isPCPSearchRedirect=true&https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39& locale=en`,
    );
    expect(component).toMatchSnapshot();
  });
  it('should render Error Screen in UI When providerDetails is undefined', async () => {
    const component = renderUI(null);
    screen.getByText(
      'Oops, it looks like something went wrong. Try again later.',
    );
    expect(component).toMatchSnapshot();
  });
});
