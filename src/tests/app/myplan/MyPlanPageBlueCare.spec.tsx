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
      futureEffective: false,
      fsaOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      blueCare: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('My Plan Page for BlueCare member', () => {
  it('should render My Plan page UI features for Bluecare member', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    screen.getByRole('heading', { name: 'Plan Details' });
    screen.getByText('Plan Type:');
    screen.getByText('BlueCare Medicaid');
    screen.getByText('View More ID Card Options');
    screen.getByText('View Plan Contact Information');
    screen.getByText('View Other Plan Information');
    screen.getByText('Manage My Plan');
    screen.getByText('Profile Settings');
    screen.getByText('Katie Beckett Banking Info');
    expect(component.baseElement).toMatchSnapshot();
  });
});
