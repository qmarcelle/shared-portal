process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777818';
import LogIn from '@/app/login/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

const setupUI = () => {
  render(<LogIn />);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};

describe('Multiple Login Attempts Error', () => {
  it('should render Multiple Login Attempts Error Messages', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i);
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'username');
    await userEvent.type(password, 'password');

    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {
          data: { errorCode: 'UI-405' },
        },
        status: 400,
      }),
    );

    fireEvent.click(btnLogIn);
    await waitFor(() => {
      expect(screen.getByLabelText(/Logging In.../i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication',
      {
        username: 'username',
        password: 'password',
      },
    );

    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        'You have attempted to log in too many times. Please wait 15 minutes to try again.',
      ),
    ).toBeVisible();
  });
});
