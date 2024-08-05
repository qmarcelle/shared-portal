import { WellnessRewards } from '@/app/myHealth/components/WellnessRewards';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <WellnessRewards
      className="section"
      quarter="Q2"
      quarterlyPointsEarned={50}
      quarterlyMaxPoints={100}
      color2="#5DC1FD"
      color1="#f2f2f2"
      totalAmount={400}
      totalAmountEarned={100}
      linkText="View Ways to Earn"
    />,
  );
};

describe('WellnessRewardsSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getByText('My Points')).toBeVisible();
    expect(screen.getByText('Earned')).toBeVisible();
    expect(screen.getByText('Quarterly Max')).toBeVisible();
    expect(screen.getByText('View Rewards FAQ')).toBeVisible();
    expect(screen.getByText('View Ways to Earn')).toBeVisible();
    // eslint-disable-next-line quotes
    expect(screen.getByText("You've earned")).toBeVisible();
    expect(screen.getByText('$100.00')).toBeVisible();
    expect(screen.getByText('of $400.00 Yearly Max')).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
