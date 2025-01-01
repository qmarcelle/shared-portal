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
describe('Primary Care Provider', () => {
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
