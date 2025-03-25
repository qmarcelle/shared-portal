process.env.NEXT_PUBLIC_PORTAL_ERROR_URL = 'https://www.bcbst.com/error/';
import LogInPage from '@/app/login/page';
import { useLoginStore } from '@/app/login/stores/loginStore';
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
const resetToHome = useLoginStore.getState().resetToHome;

const setupUI = () => {
  render(<LogInPage />);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i, {
    selector: 'input',
  });
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};

describe('Login Service Errors', () => {
  afterEach(() => {
    resetToHome();
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
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

  test('Login Service ErrorCode 600 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();
    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PP-600' },
    };
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 600,
      }),
    );

    fireEvent.click(loginButton);
    await waitFor(async () => {
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
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          process.env.NEXT_PUBLIC_PORTAL_ERROR_URL,
        );
      });
    });
  });

  test('Login Service ErrorCode 601 error', async () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();
    await userEvent.type(inputUsername, 'username');
    await userEvent.type(inputPassword, 'password');

    const esRespData = {
      data: { errorCode: 'PP-601' },
    };
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: esRespData,
        status: 600,
      }),
    );

    fireEvent.click(loginButton);
    await waitFor(async () => {
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
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          process.env.NEXT_PUBLIC_PORTAL_ERROR_URL,
        );
      });
    });
  });
});
