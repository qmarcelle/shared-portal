import LogInPage from '@/app/login/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
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
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};

describe('Login Service Errors', () => {
  afterEach(() => {
    const backtoHomeLink = screen.getByRole('button', {
      name: /Back to Homepage/i,
    });
    fireEvent.click(backtoHomeLink);
  });
  test('Login Service ErrorCode 501 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-501' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Login Service ErrorCode 502 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-502' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 503 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-503' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 504 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-504' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 505 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-505' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 506 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PI-506' },
    };

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 400 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 401 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 401,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 403 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 403,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 404 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 404,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 408 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 408,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
  test('Login Service ErrorCode 500 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );

    fireEvent.click(loginButton);

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
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });
});
