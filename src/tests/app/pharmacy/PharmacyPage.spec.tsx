import PharmacyPage from '@/app/pharmacy/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
process.env.NEXT_PUBLIC_SHOP_OVER_THE_COUNTER = 'https://www.shopbcbstotc.com';

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

const vRules = {
  user: {
    vRules: {
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      medicarePrescriptionPaymentPlanEligible: true,
      displayPharmacyTab: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

describe('Pharmacy Page', () => {
  it('should render the page correctly', async () => {
    const Page = await PharmacyPage();
    const container = render(Page);
    expect(screen.getByText('My Recent Pharmacy Claims')).toBeVisible();
    expect(screen.getByText('View All Pharmacy Claims')).toBeVisible();
    fireEvent.click(screen.getByText(/View All Pharmacy Claims/i));
    expect(mockPush).toHaveBeenCalledWith('/claimSnapshotList');
    fireEvent.click(screen.getByText(/123 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    fireEvent.click(screen.getByText(/565 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    fireEvent.click(screen.getByText(/890 Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith('/pharmacy/pharmacyClaims');
    expect(container).toMatchSnapshot();
  });

  it('should render the Prescription Payment Plan Options card if the pzn rule is true', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;

    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(
      screen.getByText('Prescription Payment Options'),
    ).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });

  it('should not render the Prescription Payment Plan Options card if the pzn rule is false', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.medicarePrescriptionPaymentPlanEligible = false;
    vRules.user.vRules.terminated = true;
    vRules.user.vRules.wellnessOnly = true;
    vRules.user.vRules.fsaOnly = true;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(screen.queryByText('Prescription Payment Options')).toBeNull();
    expect(component).toMatchSnapshot();
  });
});
