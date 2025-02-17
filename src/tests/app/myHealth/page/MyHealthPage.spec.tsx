import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
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
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.MEMBER,
          plan: {
            fhirId: '654543434',
            grgrCk: '7678765456',
            grpId: '65654323',
            memCk: '502622001',
            sbsbCk: '5654566',
            subId: '56543455',
          },
        },
        vRules: {
          individual: true,
          futureEffective: false,
          fsaOnly: false,
          terminated: false,
          katieBeckNoBenefitsElig: false,
          chipRewardsEligible: true,
          blueHealthRewardsEligible: true,
          fullyInsured: true,
          levelFunded: true,
        },
      },
    }),
  ),
}));

describe('My Health Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('should render page correctly when we have valid session', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [
              { rewardType: 'Fully Insured - Points', balance: '70' },
              { rewardType: 'Fully Insured - Dollars', balance: '60.00' },
            ],
          },
        },
      },
    });
    const component = await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('70 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
    expect(component).toMatchSnapshot();
  });
});
