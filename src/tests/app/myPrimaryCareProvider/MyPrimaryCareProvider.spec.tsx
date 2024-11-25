import { AddProviderContactInformation } from '@/app/myPrimaryCareProvider/components/AddProviderContactInformation';
import { AddProviderInfoItem } from '@/app/myPrimaryCareProvider/components/AddProviderInfoItem';
import { HelpWithPrimaryCareProvider } from '@/app/myPrimaryCareProvider/components/HelpWithPrimaryCareProvider';
import { ProviderContactInformation } from '@/app/myPrimaryCareProvider/components/ProviderContactInformation';
import { ProviderInfoItem } from '@/app/myPrimaryCareProvider/components/ProviderInfoItem';
import MyPrimaryCareProvider from '@/app/myPrimaryCareProvider/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <ProviderContactInformation
        providerContactInfoDetails={[
          {
            memberName: 'Maddison Hall',
            providerName: 'John Hopkins',
            providerType: 'Primary Care Provider',
            DOB: '01/01/1979',
            facilityAddress:
              'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
            phone: '(123) 456-7890',
            addProvider: true,
          },
          {
            memberName: 'Forest Hall',
            providerName: 'Stephen Charles',
            providerType: 'Primary Care Provider',
            DOB: '01/01/2001',
            facilityAddress:
              'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
            phone: '(123) 456-7890',
            addProvider: true,
          },
        ]}
      />
      <AddProviderContactInformation
        addProviderContactInfoDetails={[
          {
            providerMemberName: 'Corey Hall',
            providerDOB: '01/01/2002',
          },
          {
            providerMemberName: 'Telly Hall',
            providerDOB: '01/01/2005',
          },
          {
            providerMemberName: 'Janie Hall',
            providerDOB: '01/01/2015',
          },
        ]}
      />
      <HelpWithPrimaryCareProvider />,
      <ProviderInfoItem />,
      <AddProviderInfoItem
        addProviderInfo={[
          { providerMemberName: 'Corey Hall', providerDOB: '01/01/2002' },
        ]}
      />
      ,
      <MyPrimaryCareProvider />,
    </>,
  );
};

describe('MyPrimaryCareProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'My Primary Care Provider' });
    screen.getAllByText('Chris Hall');
    screen.getAllByText('DOB : 01/01/2005');
    screen.getAllByText('John Hopkins');
    screen.getAllByText('Primary Care Provider');
    screen.getAllByText('Facility Address');
    screen.getAllByText(
      'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
    );
    screen.getAllByText('John Hopkins');
    const phone = screen.getAllByText(/Phone/i);
    expect(phone[0]).toBeInTheDocument();
    screen.getAllByText('(123) 456-7890');

    const updateLink: HTMLAnchorElement[] = screen.getAllByRole('link');
    expect(updateLink[0].textContent).toEqual('Update');
    expect(updateLink[0].href).toContain('/updateMyPrimaryCareProvider');
    screen.getByText('Dependents');
    screen.getAllByText('Forest Hall');
    screen.getAllByText('DOB: 01/01/2001');
    const ProviderLink: HTMLAnchorElement[] = screen.getAllByRole('link');
    expect(ProviderLink[1].textContent).toEqual('Update');
    screen.getAllByText('Help with My Primary Care Provider');
    screen.getAllByText('Telly Hall');
    screen.getAllByText('DOB: 01/01/2005');
    screen.getAllByText('Help with My Primary Care Provider');
    expect(component.baseElement).toMatchSnapshot();
  });
});
