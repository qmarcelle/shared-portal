import { LoginResponse } from '@/app/login/models/api/login';
import LogInPage from '@/app/login/page';
import { initPingOne } from '@/app/pingOne/setupPingOne';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

jest.setTimeout(30000);

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

describe('Log In of User', () => {
  test('should render all required elements correctly', () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    expect(inputUsername).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('Login user successfully without MFA', async () => {
    //const mockAxios = mock<Axios>()
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'DEVICE_SELECTION_REQUIRED',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          mfaDeviceList: [],
        },
        details: {
          componentName: 'mfauthentication',
          componentStatus: 'Success',
          returnCode: '0',
          subSystemName: 'Multiple Services',
          message: '',
          problemTypes: '0',
          innerDetails: {
            statusDetails: [
              {
                componentName: 'getSDKToken',
                componentStatus: 'Success',
                returnCode: '0',
                subSystemName: '',
                message: '',
                problemTypes: '0',
                innerDetails: {
                  statusDetails: [],
                },
              },
              {
                componentName: 'InvokeFlow',
                componentStatus: 'Success',
                returnCode: '0',
                subSystemName: '',
                message: '',
                problemTypes: '0',
                innerDetails: {
                  statusDetails: [],
                },
              },
              {
                componentName: 'submUsrInfo',
                componentStatus: 'Success',
                returnCode: '0',
                subSystemName: '',
                message: '',
                problemTypes: '0',
                innerDetails: {
                  statusDetails: [],
                },
              },
            ],
          },
        },
      } satisfies ESResponse<LoginResponse>,
    });

    const ui = setupUI();

    await userEvent.type(ui.inputUsername, 'username');
    await userEvent.type(ui.inputPassword, 'password');
    // The input username field should have the value
    expect(ui.inputUsername).toHaveValue('username');
    // The input password field should have the password
    expect(ui.inputPassword).toHaveValue('password');

    userEvent.click(ui.loginButton);
    // Should show login indicator
    await waitFor(() => {
      expect(screen.getByLabelText(/Logging In.../i)).toBeInTheDocument();
    });
    // Should call login post api with correct parameters
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
    // The loading progress should be out now and not vivible
    expect(screen.queryByLabelText(/Logging In.../i)).not.toBeInTheDocument();
    // Verify that the `getData` method of the `_pingOneSignals` object on the global `window` has been called.
    expect(window._pingOneSignals.getData).toHaveBeenCalled();
  });

  test('should call initSilent with correct arguments when initializing PingOne', async () => {
    initPingOne();
    expect(window._pingOneSignals.initSilent).toHaveBeenCalledWith({
      envId: 'DEV',
      universalDeviceIdentification: true,
    });
    expect(window._pingOneSignals.initSilent).toHaveBeenCalledTimes(1);
  });
});
