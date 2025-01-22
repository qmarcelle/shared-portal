import LogInPage from '@/app/login/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));
const setupUI = () => {
  render(<LogInPage />);
};
process.env.NEXT_PUBLIC_PORTAL_URL = 'https://test.bcbst.com/';
describe('BackToHomepage redirection', () => {
  test('Redirection from Backtohome Page to public portal', async () => {
    setupUI();
    const backtoHomeLink = screen.getByRole('button', {
      name: /Back to Homepage/i,
    });
    fireEvent.click(backtoHomeLink);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        process.env.NEXT_PUBLIC_PORTAL_URL,
      );
    });
  });
});
