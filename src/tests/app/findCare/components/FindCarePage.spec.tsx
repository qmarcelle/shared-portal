import FindCarePage from '@/app/findcare/page';
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
});
