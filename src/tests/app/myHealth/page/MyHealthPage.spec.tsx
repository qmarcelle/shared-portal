import MyHealthPage from '@/app/myHealth/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = async () => {
  const result = await MyHealthPage();
  return render(result);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        vRules: {
          individual: true,
          futureEffective: false,
          fsaOnly: false,
          terminated: false,
          katieBeckNoBenefitsElig: false,
          chipRewardsEligible: true,
          blueHealthRewardsEligible: true,
        },
      },
    }),
  ),
}));

describe('My Health Page', () => {
  it('should render page correctly when we have valid session', async () => {
    const component = await setupUI();
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
