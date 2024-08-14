import { ViewCareOptions } from '@/app/findcare/components/ViewCareOptions';
import { render, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';

const renderUI = (width: number = 1000) => {
  return render(
    <ResponsiveContext.Provider value={{ width }}>
      <ViewCareOptions
        className="large-section"
        claims={[
          {
            id: '1',
            claimStatus: '',
            claimType: 'PrimaryCare',
            claimTotal: 'null',
            issuer: 'Primary Care Options',
            memberName:
              'Learn more about Primary Care Providers and view your options.',
            serviceDate: '',
            claimInfo: {},
            priorAuthFlag: false,
            claimsFlag: false,
            viewCareFlag: true,
          },
          {
            id: '2',
            claimStatus: '',
            claimType: 'MentalCare',
            claimTotal: null,
            issuer: 'Mental Care Options',
            memberName:
              'Learn more about Mental Health Providers and view your options.',
            serviceDate: '',
            claimInfo: {},
            priorAuthFlag: false,
            claimsFlag: false,
            viewCareFlag: true,
          },
        ]}
      />
    </ResponsiveContext.Provider>,
  );
};

describe('ViewCareOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();

    // screen.getByRole('heading', { name: 'View Care Options' })
    screen.getByText('View Care Options');

    screen.getByText('Primary Care Options');
    screen.getByText(
      'Learn more about Primary Care Providers and view your options.',
    );
    screen.getByAltText(/PrimaryCare/i);

    screen.getByText('Mental Care Options');
    screen.getByText(
      'Learn more about Mental Health Providers and view your options.',
    );
    screen.getByAltText(/MentalCare/i);

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI(700);

    // screen.getByRole('heading', { name: 'View Care Options' })
    screen.getByText('View Care Options');

    screen.getByText('Primary Care Options');
    screen.getByText(
      'Learn more about Primary Care Providers and view your options.',
    );
    screen.getByAltText(/PrimaryCare/i);

    screen.getByText('Mental Care Options');
    screen.getByText(
      'Learn more about Mental Health Providers and view your options.',
    );
    screen.getByAltText(/MentalCare/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
