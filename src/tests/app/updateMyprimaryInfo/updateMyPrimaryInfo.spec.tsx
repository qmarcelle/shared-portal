import UpdateMyPrimaryCareProviderPage from '@/app/updateMyPrimaryCareProvider/page';
import SelectPCPImage from '@/public/assets/select_pcp.png';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Image from 'next/image';

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

const renderUI = async () => {
  const result = await UpdateMyPrimaryCareProviderPage();
  return render(result);
};

describe('UpdateMyPrimaryCareProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', async () => {
    const component = await renderUI();
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

  it('should render UI correctly with validations', async () => {
    const component = await renderUI();
    const inputCity = screen.getByLabelText(/City/i);
    const inputState = screen.getByLabelText(/State/i);
    const inputCounty = screen.getByLabelText(/County/i);
    const inputZipCode = screen.getByLabelText(/ZIP Code/i);
    const inputPhoneNumber = screen.getByLabelText(/Phone Number/i);
    const submitButton = screen.getByRole('button', {
      name: /Submit Request/i,
    });
    await userEvent.type(inputCity, 'KINGSPORT');
    await userEvent.type(inputCounty, 'Shleby');
    await userEvent.type(inputState, 'TN');
    //await userEvent.type(inputZipCode, '12345');
    await userEvent.type(inputPhoneNumber, '1234567890');

    //test zipcode formate validation
    await userEvent.type(inputZipCode, '123');
    expect(screen.getAllByText('Please enter a valid zip code.')).toBeVisible;

    //test PhoneNumber formate validation
    await userEvent.type(inputPhoneNumber, '1234');
    expect(
      screen.getAllByText(
        'Please enter a valid contact phone number (XXX-XXX-XXXX).',
      ),
    ).toBeVisible;

    fireEvent.click(submitButton);
    expect(screen.getAllByText('(Required Field)')).toBeVisible;

    expect(component.baseElement).toMatchSnapshot();
  });
});
