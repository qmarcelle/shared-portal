import LogInPage from '@/app/login/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock useRouter:
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));

const setupUI = () => {
  render(<LogInPage />);
};

describe('Login API Error', () => {
  it('should render all the required components', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i);
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'bcbstuser222');
    await userEvent.type(password, 'Th1sisagreatpassword!!');

    mockedAxios.post.mockRejectedValueOnce({});
    fireEvent.click(btnLogIn);

    // Should call the api with correct values
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication',
        {
          username: 'bcbstuser222',
          password: 'Th1sisagreatpassword!!',
        },
      );
      expect(screen.getByText('Login Error')).toBeVisible();
      expect(
        screen.getByText(
          'Something went wrong while logging in to your profile. Please try again later.',
        ),
      ).toBeVisible();
    });
  });
});
