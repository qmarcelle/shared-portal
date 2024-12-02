import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
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
    jest.resetAllMocks();
  });
  beforeEach(() => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  it('should render Wellness Rewards with error card when it get failed with 400', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 400,
        errorObject: {
          desc: 'Mocked Error',
        },
      }),
    );
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();
  });
  it('should render Wellness Rewards with error card when it get failed with 400', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {},
    });
    await setupUI();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/memberRewards/member/getMbrWellness',
      { memberId: '90221882300', accounts: { isBalance: true } },
    );
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();
  });
});
