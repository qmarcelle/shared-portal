import FindCarePage from '@/app/findcare/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = async () => {
  const page = await FindCarePage();
  return render(page);
};

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

process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';
process.env.NEXT_PUBLIC_IDP_EYEMED = 'EyeMed';

describe('Find Care Page', () => {
  it('should redirect to SSO launch page when we click on Pharmacy Pill', async () => {
    await renderUI();
    expect(screen.getByText(/Pharmacy/i));
    fireEvent.click(screen.getByText(/Pharmacy/i));
    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=CVS&target=PHARMACY_SEARCH_FAST',
    );
  });

  it('should redirect to SSO launch page when we click on Prescription Drugs Pill', async () => {
    await renderUI();
    await waitFor(() => {
      expect(screen.getByText(/Prescription Drugs/i));
    });
    fireEvent.click(screen.getByText(/Prescription Drugs/i));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/sso/launch?PartnerSpId=CVS&target=CHECK_DRUG_COST_FAST',
      );
    });
  });

  it('should redirect to SSO launch page when we click on Vision Pill', async () => {
    await renderUI();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Vision/i }));
    });
    fireEvent.click(screen.getByRole('button', { name: /Vision/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/sso/launch?PartnerSpId=EyeMed&target=',
      );
    });
  });

  it('should redirect to SSO launch page when we click on Eye Doctor Pill', async () => {
    await renderUI();
    await waitFor(() => {
      expect(screen.getByText(/Eye Doctor/i));
    });
    fireEvent.click(screen.getByText(/Eye Doctor/i));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/sso/launch?PartnerSpId=EyeMed&target=',
      );
    });
  });
});
