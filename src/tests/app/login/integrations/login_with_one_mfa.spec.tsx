import { LoginResponse } from '@/app/login/models/api/login';
import { SubmitMfaOtpResponse } from '@/app/login/models/api/submit_mfa_otp_response';
import LogInPage from '@/app/login/page';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
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

jest.setTimeout(30000);

// Mock window.open
global.open = jest.fn();

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

describe('Log In of User', () => {
  test('should render all required elements correctly', () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    expect(inputUsername).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('Login user successfully with only one MFA', async () => {
    //const mockAxios = mock<Axios>()
    mockedAxios.post
      .mockResolvedValueOnce({
        // call to /login
        data: {
          data: {
            message: 'DEVICE_SELECTION_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
            mfaDeviceList: [
              {
                deviceType: 'SMS',
                deviceId: '9803c2fd-1106-44a7-828a-c0fa9ef34427',
                deviceStatus: 'ACTIVE',
                createdAt: '2024-04-29T12:52:29.385Z',
                updatedAt: '2024-04-29T12:53:27.821Z',
                phone: '+1.4232220222',
              },
            ],
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
      })
      .mockResolvedValueOnce({
        // call to /submitMfa
        data: {
          data: {
            interactionId: 'interactionId3',
            interactionToken: 'interactionToken3',
            accessToken:
              'eyJraWQiOiJkNDY1OGU3MC1iOGI5LTExZWUtOThhNi0zYjFmMjE1ZDRhZmMiLCJhbGciOiJSUzI1NiJ9',
            refreshToken:
              'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
            idToken:
              'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
            flowStatus: 'COMPLETED',
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
        } satisfies ESResponse<SubmitMfaOtpResponse>,
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
      },
    );
    // The loading progress should be out now and not visible
    expect(screen.queryByLabelText(/Logging In.../i)).not.toBeInTheDocument();

    // The mfa code entry screen should be visible
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Resend Code' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Choose a Different Method',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'contact us' }),
      ).toBeInTheDocument();
    });

    // Enter the mfa code
    const mfaCodeEntry = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(mfaCodeEntry, 'some-code');

    // The code entry field should have correct value
    expect(mfaCodeEntry).toHaveValue('some-code');

    // Click confirm button
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    userEvent.click(confirmBtn);

    // Assert the loading indicator came in
    await waitFor(() => {
      expect(screen.getByLabelText(/Confirming/i)).toBeInTheDocument();
    });

    // Assert the /submitMfa api was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/provideOtp',
      {
        interactionId: 'interactionId1',
        interactionToken: 'interactionToken1',
        otp: 'some-code',
      },
    );

    // Assert the loading indicator went off
    expect(screen.queryByLabelText(/Confirming/i)).not.toBeInTheDocument();

    // Assert the user user is taken to dashboard
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
