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
    expect(screen.getAllByText('My Points').length).toBe(2);
    expect(screen.getAllByText('Earned').length).toBe(2);
    expect(screen.getAllByText('Quarterly Max').length).toBe(2);
    expect(screen.getAllByText('View Rewards FAQ').length).toBe(2);
    expect(screen.getAllByText('View Ways to Earn').length).toBe(2);
    expect(screen.getAllByText(/You've earned/i).length).toBe(2);
    expect(screen.getAllByText('$100.00').length).toBe(2);
    expect(screen.getAllByText('of $400.00 Yearly Max').length).toBe(2);

    expect(component).toMatchSnapshot();
  });
});
