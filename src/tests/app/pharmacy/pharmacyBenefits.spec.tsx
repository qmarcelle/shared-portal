import PharmacyPage from '@/app/pharmacy/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

const vRules = {
  user: {
    vRules: {
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      blueCare: true,
      active: false,
      otcEnable: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

// Mock useRouter:
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockPush,
    };
  },
}));

describe('Pharmacy Benefits', () => {
  it('should render Pharmacy Benefits correctly', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    screen.getByRole('heading', { name: 'Pharmacy Benefits' });
    screen.getAllByText(
      'You have a pharmacy card just for your prescription drugs. Here are some helpful things to know:',
    );
    screen.getAllByText(
      'Coverage and claims for prescriptions are managed by your pharmacy benefit manager. That’s an independent company that specializes in these services.',
    );
    expect(
      screen.getAllByRole('link', {
        name: 'TennCare’s site for more info',
      })[0],
    ).toHaveProperty(
      'href',
      'https://www.tn.gov/tenncare/members-applicants/pharmacy.html',
    );
    expect(
      screen.queryByText(
        'Your plan does not include Medicare Part D prescription drug coverage. Please consult your Evidence of Coverage (EOC) for more information on medical benefits.',
      ),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render Ui properly for Freedom MA BlueAdvantage member', async () => {
    vRules.user.vRules.active = true;
    vRules.user.vRules.otcEnable = true;
    vRules.user.vRules.blueCare = false;
    const mockAuth = jest.requireMock('src/auth').auth;

    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: { visibilityRules: vRules.user.vRules },
    });
    const component = await renderUI();
    expect(
      screen.getByRole('heading', { name: 'Pharmacy Benefits' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your plan does not include Medicare Part D prescription drug coverage. Please consult your Evidence of Coverage (EOC) for more information on medical benefits.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
      ),
    ).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
