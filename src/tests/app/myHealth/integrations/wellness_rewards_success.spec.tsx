import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = async () => {
  const result = await MyHealthPage();
  return render(result);
};

const vRules = {
  user: {
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
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('My Health Page Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('should render Wellness Rewards with progress bar & pie chart when points & dollars are available', async () => {
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
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('70 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
  });
  it('should render Wellness Rewards with progress bar & pie chart when points alone are available', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [{ rewardType: 'Fully Insured - Points', balance: '70' }],
          },
        },
      },
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('70 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
  });
  it('should render Wellness Rewards with progress bar & pie chart when points is greater than maximum are available', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [{ rewardType: 'Fully Insured - Points', balance: '120' }],
          },
        },
      },
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('120 pts').length).toBe(2);
    expect(screen.getAllByText('$120.00').length).toBe(2);
  });
  it('should render Wellness Rewards with progress bar & pie chart when dollars alone are available', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [
              { rewardType: 'Fully Insured - Dollars', balance: '60.00' },
            ],
          },
        },
      },
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('60 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
  });
  it('should render Wellness Rewards with progress bar & pie chart when points & dollars are not available', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [{ rewardType: 'Fully Insured', balance: '70' }],
          },
        },
      },
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('0 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
  });
  it('should render Wellness Rewards with progress bar & pie chart when plan is not fully insured & levelFunded', async () => {
    vRules.user.vRules.fullyInsured = false;
    vRules.user.vRules.levelFunded = false;
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accounts: {
            balance: [{ rewardType: 'Fully Insured - Points', balance: '70' }],
          },
        },
      },
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(screen.getAllByText('0 pts').length).toBe(2);
    expect(screen.getAllByText('$0.00').length).toBe(2);
  });
});
