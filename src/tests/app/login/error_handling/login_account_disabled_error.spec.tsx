import { LoginComponent } from '@/app/login/components/LoginComponent';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  render(<LoginComponent />);
};

describe('Login Account Disabled credentials Error', () => {
  it('should render all the required Error Messages', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i, {
      selector: 'input',
    });
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'username');
    await userEvent.type(password, 'password');
    const esRespData = {
      data: { errorCode: 'UI-404' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 404,
      }),
    );

    fireEvent.click(btnLogIn);

    // Should call the api with correct values
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication',
        {
          username: 'username',
          password: 'password',
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
        },
      );
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "We didn't recognize the username or password you entered. Please try again.",
        ),
      ).toBeVisible();
    });
  });
});
