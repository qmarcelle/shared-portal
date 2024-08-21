import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <RecentClaimSection
      className="large-section"
      title="Recent Claims"
      linkText="View All Claims"
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
          isMiniCard: true,
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
          isMiniCard: true,
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
          isMiniCard: true,
        },
      ]}
    />,
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
    screen.getAllByAltText(/medical/i);

    screen.getByText('John Does');
    screen.getByText('Visited on 01/16/2024, For Aly Jame');
    screen.getByText('Denied');
    screen.getAllByAltText(/dental/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
