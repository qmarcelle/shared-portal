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
        name: 'visit TennCare’s site for more info',
      })[0],
    ).toHaveProperty(
      'href',
      'https://www.tn.gov/tenncare/members-applicants/pharmacy.html',
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
