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
      displayPharmacyTab: true,
      terminated: false,
      wellnessOnly: false,
      fsaOnly: false,
      blueCare: false,
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
});
