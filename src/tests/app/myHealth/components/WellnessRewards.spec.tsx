import { WellnessRewards } from '@/app/myHealth/components/WellnessRewards';
import { MemberRewards } from '@/app/myHealth/models/app/my_health_data';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (data: MemberRewards) => {
  return render(<WellnessRewards className="section" memberRewards={data} />);
};
process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS = 'sp_bluehealthrewards';
const baseUrl = window.location.origin;
describe('WellnessRewardsSection', () => {
  it('should render the UI correctly for Self Funded', async () => {
    const data = {
      quarterlyPointsEarned: 70,
      quarterlyMaxPoints: 100,
      totalAmountEarned: 0,
      totalAmount: 100,
      isSelfFunded: true,
    };
    const component = renderUI(data);
    expect(screen.getByText('Active Rewards - Self Funded')).toBeVisible();
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('Annual Max').length).toBe(1);
    expect(screen.getAllByText('View Ways to Earn & Learn more').length).toBe(
      2,
    );
    expect(screen.getAllByText(/You've earned/i).length).toBe(1);
    expect(screen.getAllByText('$100').length).toBe(1);

    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly for Fully Insured & Level Funded', async () => {
    const data = {
      quarterlyPointsEarned: 70,
      quarterlyMaxPoints: 100,
      totalAmountEarned: 0,
      totalAmount: 100,
      isSelfFunded: false,
    };
    const component = renderUI(data);
    expect(
      screen.getByText('Active Rewards - Fully Insured & Level Funded'),
    ).toBeVisible();
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('Quarterly Max').length).toBe(1);
    expect(screen.getAllByText('View Ways to Earn & Learn more').length).toBe(
      2,
    );
    expect(screen.getAllByText(/You've earned/i).length).toBe(1);
    expect(screen.getAllByText('70').length).toBe(1);

    expect(component).toMatchSnapshot();
  });

  it('should redirect ICARO SSO on click of View Ways to Earn & Learn more', async () => {
    const data = {
      quarterlyPointsEarned: 70,
      quarterlyMaxPoints: 100,
      totalAmountEarned: 0,
      totalAmount: 100,
      isSelfFunded: false,
    };
    const component = renderUI(data);
    expect(
      screen.getByText('Active Rewards - Fully Insured & Level Funded'),
    ).toBeVisible();
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('View Ways to Earn & Learn more').length).toBe(
      2,
    );
    expect(
      screen.getByRole('link', {
        name: 'View Ways to Earn & Learn more',
      }),
    ).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=sp_bluehealthrewards`,
    );

    expect(component).toMatchSnapshot();
  });
});
