process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.NEXT_PUBLIC_PORTAL_URL = 'https://test.bcbst.com/';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/login/models/api/login';
import LogInPage from '@/app/login/page';
import { useLoginStore } from '@/app/login/stores/loginStore';
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
const resetToHome = useLoginStore.getState().resetToHome;

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

describe('Log In of User whose Email Id is not registered yet', () => {
  afterEach(() => {
    resetToHome();
  });
  it('Email Registration is success with only one MFA', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        // call to /login
        data: {
          data: {
            message: 'EMAIL_VERIFICATION_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
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
      })
      .mockResolvedValueOnce({
        // call to /verifyEmailOtp
        data: {
          data: {
            message: 'OTP_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
            mfaDeviceList: [
              {
                deviceType: 'EMAIL',
                deviceId: 'd7403f45-3d96-4323-a928-5851280472c1',
                deviceStatus: 'ACTIVE',
                createdAt: '2024-08-20T14:11:52.870Z',
                updatedAt: '2024-08-20T14:11:52.870Z',
                email: 'alex_cred@bcbst.com',
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
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        ipAddress: '1',
        deviceProfile: 'Testing',
      },
    );

    //Login Email Verification screen should be visible
    await waitFor(() => {
      expect(
        screen.getByText(
          'We’ll need to confirm your email address before you can log in.',
        ),
      ).toBeVisible();
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
      ).toBeInTheDocument();
    });

    // Enter the verify email code
    const securityCode = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(securityCode, 'x6yd8ef');
    // Click confirm button
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Code' });
    userEvent.click(confirmBtn);
    // Assert the loading indicator came in
    await waitFor(() => {
      expect(screen.getByLabelText(/Confirming.../i)).toBeInTheDocument();
    });

    // Assert the /verifyEmailOtp api was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/verifyEmailOtp',
      {
        interactionId: 'interactionId1',
        interactionToken: 'interactionToken1',
        emailOtp: 'x6yd8ef',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        username: 'username',
      },
    );

    // Assert the loading indicator went off
    expect(screen.queryByLabelText(/Confirming/i)).not.toBeInTheDocument();

    // The mfa code entry screen should be visible since it's single device
    await waitFor(() => {
      expect(screen.getByText('a********@bcbst.com')).toBeVisible();
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
      ).toBeInTheDocument();
      // Assert the Choose a Different Method should not be visible
      expect(
        screen.queryByLabelText(/Choose a Different Method/i),
      ).not.toBeInTheDocument();
    });
  });
  it('Email Registration is success with multiple MFA', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        // call to /login
        data: {
          data: {
            message: 'EMAIL_VERIFICATION_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
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
      })
      .mockResolvedValueOnce({
        // call to /verifyEmailOtp
        data: {
          data: {
            message: 'DEVICE_SELECTION_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
            mfaDeviceList: [
              {
                deviceType: 'EMAIL',
                deviceId: 'd7403f45-3d96-4323-a928-5851280472c1',
                deviceStatus: 'ACTIVE',
                createdAt: '2024-08-20T14:11:52.870Z',
                updatedAt: '2024-08-20T14:11:52.870Z',
                email: 'alex_cred@bcbst.com',
              },
              {
                deviceType: 'TOTP',
                deviceId: 'd7403f45-3d96-4323-a928-5851280472c2',
                deviceStatus: 'ACTIVE',
                createdAt: '2024-08-20T14:11:52.870Z',
                updatedAt: '2024-08-20T14:11:52.870Z',
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
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        ipAddress: '1',
        deviceProfile: 'Testing',
      },
    );

    // The mfa code entry screen should be visible
    await waitFor(() => {
      expect(
        screen.getByText(
          'We’ll need to confirm your email address before you can log in.',
        ),
      ).toBeVisible();
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
      ).toBeInTheDocument();
    });

    // Enter the verify email code
    const securityCode = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(securityCode, 'x6yd8ef');
    // Click confirm button
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Code' });
    userEvent.click(confirmBtn);
    // Assert the loading indicator came in
    await waitFor(() => {
      expect(screen.getByLabelText(/Confirming.../i)).toBeInTheDocument();
    });

    // Assert the /verifyEmailOtp api was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/verifyEmailOtp',
      {
        interactionId: 'interactionId1',
        interactionToken: 'interactionToken1',
        emailOtp: 'x6yd8ef',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        username: 'username',
      },
    );

    // Assert the loading indicator went off
    expect(screen.queryByLabelText(/Confirming/i)).not.toBeInTheDocument();

    // The Select MFA Device screen should be visible since it has multiple device
    await waitFor(() => {
      expect(
        screen.getByText('How would you like to receive your security code?'),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: 'Send Code' }),
      ).toBeInTheDocument();
    });
  });
  it('Email Registration is success When MFA is Disabled', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        // call to /login
        data: {
          data: {
            message: 'EMAIL_VERIFICATION_REQUIRED',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
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
      })
      .mockResolvedValueOnce({
        // call to /verifyEmailOtp
        data: {
          data: {
            message: 'MFA_Disabled',
            interactionId: 'interactionId1',
            interactionToken: 'interactionToken1',
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
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        ipAddress: '1',
        deviceProfile: 'Testing',
      },
    );

    // The mfa code entry screen should be visible
    await waitFor(() => {
      expect(
        screen.getByText(
          'We’ll need to confirm your email address before you can log in.',
        ),
      ).toBeVisible();
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
      ).toBeInTheDocument();
    });

    // Enter the verify email code
    const securityCode = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(securityCode, 'x6yd8ef');
    // Click confirm button
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Code' });
    userEvent.click(confirmBtn);
    // Assert the loading indicator came in
    await waitFor(() => {
      expect(screen.getByLabelText(/Confirming.../i)).toBeInTheDocument();
    });

    // Assert the /verifyEmailOtp api was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/verifyEmailOtp',
      {
        interactionId: 'interactionId1',
        interactionToken: 'interactionToken1',
        emailOtp: 'x6yd8ef',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        username: 'username',
      },
    );

    // Assert the loading indicator went off
    expect(screen.queryByLabelText(/Confirming/i)).not.toBeInTheDocument();

    // Assert the user user is taken to dashboard
    expect(mockReplace).toHaveBeenCalledWith('/security');
  });
});
