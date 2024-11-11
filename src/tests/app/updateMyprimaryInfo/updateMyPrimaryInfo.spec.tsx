import { PrintedRequestForm } from '@/app/updateMyPrimaryCareProvider/components/printedRequestForm';
import { ProviderDirectory } from '@/app/updateMyPrimaryCareProvider/components/ProviderDirectory';
import { SendEmailRequest } from '@/app/updateMyPrimaryCareProvider/components/SendEmailRequest';
import UpdateMyPrimaryCareProvider from '@/app/updateMyPrimaryCareProvider/page';
import SelectPCPImage from '@/public/assets/select_pcp.png';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
const renderUI = () => {
  return render(
    <>
      <UpdateMyPrimaryCareProvider />,
      <ProviderDirectory />,
      <SendEmailRequest />,
      <PrintedRequestForm />,
    </>,
  );
};

describe('UpdateMyPrimaryCareProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Update My Primary Care Provider' });
    screen.getByText(
      'Choose one option below and follow the instructions to add or update your primary care provider.',
    );
    screen.getAllByText('Option 1: Find & Select a Provider From a Directory');
    const links: HTMLAnchorElement[] = screen.getAllByRole('link');
    expect(links[0].textContent).toEqual('Go to Directory to Find a Doctor');
    expect(links[0].href).toContain(
      'https://bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39&locale=en',
    );
    render(<Image src={SelectPCPImage} alt="SelectPCPImage" />);
    const testImage = document.querySelector('img') as HTMLImageElement;
    expect(testImage.alt).toContain('link');
    expect(component.baseElement).toMatchSnapshot();
    screen.getAllByText('Option 2: Send an Email Request');
    screen.getAllByText('Member Information');
    screen.getAllByText('Member Name');
    screen.getAllByText('Provider Information');
    screen.getAllByText('Name of Provider (First & Last Name)');
    screen.getAllByText('Street Address');
    screen.getAllByText(/state/i);
    screen.getAllByText(/Zip Code/i);
    screen.getAllByText(/Phone Number/i);
    const submitRequest = screen.getAllByText(/Submit Request/i);
    expect(submitRequest[0]).toBeInTheDocument();
    screen.getAllByText('Option 3: Complete & Mail a Printed Request Form');
    screen.getAllByText(/Primary Care Provider Change Form/i);
    expect(component.baseElement).toMatchSnapshot();
  });
});
