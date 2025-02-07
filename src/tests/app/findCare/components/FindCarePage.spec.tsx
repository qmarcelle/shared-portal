import FindCarePage from '@/app/findcare/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const renderUI = async () => {
  const page = await FindCarePage();
  return render(page);
};

process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK = 'CVS';

describe('Find Care Page', () => {
  it('should redirect to SSO launch page when we click on Prescription Drugs Pill', async () => {
    await renderUI();
    await waitFor(() => {
      expect(screen.getByText(/Prescription Drugs/i));
    });
    fireEvent.click(screen.getByText(/Prescription Drugs/i));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sso/launch?PartnerSpId=CVS');
    });
  });
});
