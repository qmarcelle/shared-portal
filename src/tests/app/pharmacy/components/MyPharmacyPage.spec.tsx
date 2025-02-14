import PharmacyPage from '@/app/pharmacy/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

const vRules = {
  user: {
    vRules: {
      displayPharmacyTab: true,
      terminated: false,
      wellnessOnly: false,
      fsaOnly: false,
      blueCare: false,
      rxEssentialEligible: false,
      rxEssentialPlusEligible: false,
      rxPreferredEligible: false,
      rxChoiceEligible: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

// Mock useRouter:
const mockWindow = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: mockWindow,
    };
  },
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));

process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';

describe('Pharmacy Page', () => {
  it('should render Pharmacy page correctly', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.getByText('Get More with CVS Caremark')).toBeVisible();
    expect(screen.getByText('Pharmacy Documents & Forms')).toBeVisible();
    screen.getByText('Pharmacy FAQ');
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not render Pharmacy benefits if visibility rule evaluates false', async () => {
    vRules.user.vRules.displayPharmacyTab = false;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(
      screen.queryByText('Get More with CVS Caremark'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Pharmacy Documents & Forms'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Pharmacy FAQ')).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should redirect to SSO launch page when we click on Get My Prescriptions by Mail card', async () => {
    vRules.user.vRules.displayPharmacyTab = true;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    await renderUI();

    expect(screen.getByText('Get My Prescriptions by Mail')).toBeVisible();

    fireEvent.click(screen.getByText('Get My Prescriptions by Mail'));

    expect(mockWindow).toHaveBeenCalledWith('/sso/launch?PartnerSpId=CVS');
  });
  it('should download Choice formulary correctly', async () => {
    vRules.user.vRules.displayPharmacyTab = true;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: loggedInUserInfoMockResp,
    });
    const mockSync = jest.requireMock('fs').existsSync;
    mockSync.mockReturnValue(true);
    const component = await renderUI();

    expect(screen.getByText('Pharmacy Documents & Forms')).toBeVisible();
    screen.getByText('View Covered Drug List (Formulary)');

    const baseUrl = window.location.origin;

    expect(
      screen.getAllByRole('link', {
        name: 'View Covered Drug List (Formulary)',
      })[0],
    ).toHaveProperty(
      'href',
      `${baseUrl}/assets/formularies/Choice-DrugFormularyPDF/Drug-Formulary-List.pdf`,
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
