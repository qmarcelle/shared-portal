import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const setupUI = async () => {
  const result = await MyHealthPage();
  return render(result);
};

const vRules = {
  user: {
    id: 'testUser',
    currUsr: {
      umpi: '57c85test3ebd23c7db88245',
      role: UserRole.MEMBER,
      plan: {
        fhirId: '654543434',
        grgrCk: '7678765456',
        grpId: '65654323',
        memCk: '123456789',
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
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
    expect(screen.getAllByText('70').length).toBe(1);
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
    expect(screen.getAllByText('70').length).toBe(1);
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
    expect(screen.getAllByText('60').length).toBe(1);
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
    expect(screen.getAllByText('0').length).toBe(1);
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
    expect(screen.getAllByText('Wellness Rewards').length).toBe(2);
    expect(screen.getAllByText('100 pts').length).toBe(1);
    expect(screen.getAllByText('0').length).toBe(1);
  });
});
