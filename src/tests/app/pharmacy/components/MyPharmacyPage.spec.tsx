import PharmacyPage from '@/app/pharmacy/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

const vRules = {
  user: {
    currUsr: {
      plan: {
        memCk: '123456',
      },
    },
    vRules: {
      showPharmacyTab: true,
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
process.env.NEXT_PUBLIC_CVS_SSO_TARGET =
  'https://caremark/{DEEPLINK}?newLogin=yes';

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
    expect(
      screen.getByRole('link', { name: 'Visit CVS Caremark' }),
    ).toHaveProperty(
      'href',
      `${window.location.origin}/sso/launch?PartnerSpId=CVS`,
    );
    screen.getByText('Pharmacy FAQ');
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should not render Pharmacy benefits if visibility rule evaluates false', async () => {
    vRules.user.vRules.showPharmacyTab = false;
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
  it('should redirect to SSO launch page when we click on View or Refill My Prescriptions card', async () => {
    vRules.user.vRules.showPharmacyTab = true;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    await renderUI();

    expect(screen.getByText('View or Refill My Prescriptions')).toBeVisible();

    fireEvent.click(screen.getByText('View or Refill My Prescriptions'));

    expect(mockWindow).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/refillRx?newLogin=yes',
    );
  });
  it('should redirect to SSO launch page when we click on Get My Prescriptions by Mail card', async () => {
    vRules.user.vRules.showPharmacyTab = true;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    await renderUI();

    expect(screen.getByText('Get My Prescriptions by Mail')).toBeVisible();

    fireEvent.click(screen.getByText('Get My Prescriptions by Mail'));

    expect(mockWindow).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=CVS&TargetResource=https://caremark/drugSearchInit.do?newLogin=yes',
    );
  });
  it('should download Choice formulary correctly', async () => {
    vRules.user.vRules.showPharmacyTab = true;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
