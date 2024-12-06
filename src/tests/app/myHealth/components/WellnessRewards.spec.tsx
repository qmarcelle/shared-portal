import { WellnessRewards } from '@/app/myHealth/components/WellnessRewards';
import { MemberRewards } from '@/app/myHealth/models/app/my_health_data';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (data: MemberRewards) => {
  return render(<WellnessRewards className="section" memberRewards={data} />);
};

describe('WellnessRewardsSection', () => {
  it('should render the UI correctly', async () => {
    const data = {
      quarterlyPointsEarned: 70,
      quarterlyMaxPoints: 100,
      totalAmountEarned: 0,
      totalAmount: 100,
    };
    const component = renderUI(data);
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('My Points').length).toBe(2);
    expect(screen.getAllByText('Earned').length).toBe(2);
    expect(screen.getAllByText('Max').length).toBe(2);
    expect(screen.getAllByText('View Rewards FAQ').length).toBe(2);
    expect(screen.getAllByText('View Ways to Earn').length).toBe(2);
    expect(screen.getAllByText(/You've earned/i).length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
    expect(screen.getAllByText('of $100.00 Quarterly Max').length).toBe(2);

    expect(component).toMatchSnapshot();
  });
});
