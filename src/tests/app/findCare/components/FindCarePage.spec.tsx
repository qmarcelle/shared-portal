import FindCarePage from '@/app/findcare/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = async () => {
  const page = await FindCarePage();
  return render(page);
};

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

process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';

const vRules = {
  user: {
    currUsr: {
      plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
    },
    vRules: {
      myStrengthCompleteEligible: true,
      individual: true,
      fullyInsured: true,
      medical: true,
      groupRenewalDateBeforeTodaysDate: true,
      primary360Eligible: true,
      teladoc: true,
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      healthCoachElig: true,
      mentalHealthSupport: true,
      hingeHealthEligible: true,
      levelFunded: true,
      isEmboldHealth: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Find Care Page', () => {
  it('should redirect to SSO launch page when we click on Pharmacy Pill', async () => {
    await renderUI();
    expect(screen.getByText(/Pharmacy/i));
    fireEvent.click(screen.getByText(/Pharmacy/i));
    expect(mockWindow).toHaveBeenCalledWith('/sso/launch?PartnerSpId=CVS');
    process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';
  });

  it('should redirect to SSO launch page when we click on Prescription Drugs Pill', async () => {
    await renderUI();
    await waitFor(() => {
      expect(screen.getByText(/Prescription Drugs/i));
    });
    fireEvent.click(screen.getByText(/Prescription Drugs/i));
    await waitFor(() => {
      expect(mockWindow).toHaveBeenCalledWith('/sso/launch?PartnerSpId=CVS');
    });
  });

  it('should render the Virtual Care Options card if the pzn rule is true', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    screen.getByText('Virtual Care Options');
    expect(component).toMatchSnapshot();
  });

  it('should render the Virtual Care Options card if the pzn rule is false', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.groupRenewalDateBeforeTodaysDate = false;
    vRules.user.vRules.fsaOnly = true;

    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(screen.queryByText('Virtual Care Options')).toBeNull();
    expect(component).toMatchSnapshot();
  });
  it('should render the Find Medical Providers card if isEmboldHealthEligible pzn rule is true', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.isEmboldHealth = true;
    vRules.user.vRules.futureEffective = false;
    vRules.user.vRules.fsaOnly = false;
    vRules.user.vRules.terminated = false;
    vRules.user.vRules.katieBeckNoBenefitsElig = false;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(
      screen.getByText(
        'Use the employer-provided Embold Health search tool to',
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
  it('should not render the Looking for care card if isEmboldHealthEligible pzn rule is false', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.fsaOnly = true;
    vRules.user.vRules.futureEffective = true;
    vRules.user.vRules.terminated = true;
    vRules.user.vRules.katieBeckNoBenefitsElig = true;
    vRules.user.vRules.isEmboldHealth = false;

    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(screen.getByText('Looking for care? Find a:')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
