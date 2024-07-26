import { render, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { RecentClaimSection } from '../../../app/(main)/dashboard/components/RecentClaimSection';

const renderUI = (width: number = 1000) => {
  return render(
    <ResponsiveContext.Provider value={{ width }}>
      <RecentClaimSection
        className="large-section"
        claims={[
          {
            id: 'Claim98',
            claimStatus: 'Processed',
            claimType: 'Medical',
            claimTotal: '67',
            issuer: 'John Doe',
            memberName: 'Chris James',
            serviceDate: '02/06/2024',
            claimInfo: '',
          },
          {
            id: 'Claim76',
            claimStatus: 'Pending',
            claimType: 'Pharmacy',
            claimTotal: null,
            issuer: 'John Does',
            memberName: 'Aly Jame',
            serviceDate: '01/06/2024',
            claimInfo: '',
          },
          {
            id: 'Claim54',
            claimStatus: 'Denied',
            claimType: 'Dental',
            claimTotal: null,
            issuer: 'John Doea',
            memberName: 'Aly Jame',
            serviceDate: '01/16/2024',
            claimInfo: '',
          },
        ]}
      />
    </ResponsiveContext.Provider>,
  );
};

describe('RecentClaimSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', { name: 'Recent Claims' });
    screen.getByText('View All Claims');

    screen.getByText('John Doe');
    screen.getByText('Visited on 02/06/2024, For Chris James');
    screen.getByText('Processed');
    screen.getByAltText(/medical/i);

    screen.getByText('John Does');
    screen.getByText('Visited on 01/16/2024, For Aly Jame');
    screen.getByText('Denied');
    screen.getByAltText(/dental/i);

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI(700);

    screen.getByRole('heading', { name: 'Recent Claims' });
    screen.getByText('View All Claims');

    screen.getByText('John Doe');
    screen.getByText('Processed');
    screen.getByAltText(/medical/i);

    screen.getByText('John Does');
    screen.getByText('Pending');
    screen.getByAltText(/pharmacy/i);

    screen.getByText('John Doea');
    screen.getByText('Denied');
    screen.getByAltText(/dental/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
