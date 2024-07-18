import { LoginComponent } from '@/app/login/components/LoginComponent';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setupUI = () => {
  render(<LoginComponent />);
};

describe('Reset old errors', () => {
  it('should reset old error messages when new operation starts', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i);
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'username');
    await userEvent.type(password, 'password');
    const esRespData = {
      data: { errorCode: 'UI-401' },
    };

    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 401,
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
        },
      );
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "We didn't recognize the username or password you entered. Please try again. [UI-401]",
        ),
      ).toBeVisible();
    });

    fireEvent.click(btnLogIn);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication',
        {
          username: 'username',
          password: 'password',
        },
      );
      const elements = screen.getAllByText(
        // eslint-disable-next-line quotes
        "We didn't recognize the username or password you entered. Please try again. [UI-401]",
      );
      expect(elements.length).toEqual(1);
    });
  });
});
