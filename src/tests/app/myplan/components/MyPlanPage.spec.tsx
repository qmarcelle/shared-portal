import MyPlanPage from '@/app/myPlan/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await MyPlanPage();
  return render(page);
};

const vRules = {
  user: {
    vRules: {
      subscriber: true,
      wellnessOnly: false,
      payMyPremiumElig: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('My Plan Page', () => {
  it('should render Pay Premium Component on My Plan page', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.getByText('Pay Premium')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
