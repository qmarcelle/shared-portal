process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/login/models/api/login';
import { PasswordResetResponse } from '@/app/login/models/api/password_reset_response';
import { SubmitMfaOtpResponse } from '@/app/login/models/api/submit_mfa_otp_response';
import LogInPage from '@/app/login/page';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { ESResponse } from '@/models/enterprise/esResponse';
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
      refresh: jest.fn(),
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
const resetToHome = useLoginStore.getState().resetToHome;

describe('Log In User whose status is forced password reset', () => {
  afterEach(() => {
    resetToHome();
  });
  it('User should see Forced Password Reset Screen after login when MFA is Disabled', async () => {
    //Mock LoginResponse to return Reset Password.
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'PASSWORD_RESET_REQUIRED',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
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
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );
    //Assert to view Password Reset Screen
    expect(screen.getByText('Reset Your Password')).toBeVisible();
  });
  it('User should see Forced Password Reset Screen after Email Verification when Email is not verified & MFA is Disabled', async () => {
    //Mock LoginResponse to return Reset Password.
    mockedAxios.post
      .mockResolvedValueOnce({
        data: {
          data: {
            message: 'EMAIL_VERIFICATION_REQUIRED',
            interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
            interactionToken:
              '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
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
              ],
            },
          },
        } satisfies ESResponse<LoginResponse>,
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            message: 'PASSWORD_RESET_REQUIRED',
            interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
            interactionToken:
              '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
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
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );
    //Assert to view Email Verification Screen
    screen.getByRole('heading', { name: 'Let’s Verify Your Email' });

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
        interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
        interactionToken:
          '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
        emailOtp: 'x6yd8ef',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        username: 'username',
      },
    );
    //Assert to view Password Reset Screen
    expect(screen.getByText('Reset Your Password')).toBeVisible();
  });
  it('User should see Forced Password Reset Screen after Providing OTP when MFA is Enabled', async () => {
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
            flowStatus: 'PASSWORD_RESET_REQUIRED',
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
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
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

    await waitFor(() => {
      // Assert the /submitMfa api was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/provideOtp',
        {
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          otp: 'some-code',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
          policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
          userToken: expect.anything(),
        },
      );
    });
    //Assert Password Reset Screen is visible
    expect(screen.getByText('Reset Your Password')).toBeVisible();
  });
  it('User should see Forced Password Reset Screen after Email Verification When email is not verified & MFA is Enabled', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        data: {
          data: {
            message: 'EMAIL_VERIFICATION_REQUIRED',
            interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
            interactionToken:
              '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
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
              ],
            },
          },
        } satisfies ESResponse<LoginResponse>,
      })
      .mockResolvedValueOnce({
        // call to /login
        data: {
          data: {
            message: 'OTP_REQUIRED',
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
            flowStatus: 'PASSWORD_RESET_REQUIRED',
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
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );

    //Assert to view Email Verification Screen
    screen.getByRole('heading', { name: 'Let’s Verify Your Email' });

    // Enter the verify email code
    const securityCode = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(securityCode, 'x6yd8ef');
    // Click confirm button
    const verifyEmailConfirmBtn = screen.getByRole('button', {
      name: 'Confirm Code',
    });
    userEvent.click(verifyEmailConfirmBtn);
    // Assert the loading indicator came in
    await waitFor(() => {
      expect(screen.getByLabelText(/Confirming.../i)).toBeInTheDocument();
    });

    // Assert the /verifyEmailOtp api was called correctly
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication/verifyEmailOtp',
      {
        interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
        interactionToken:
          '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
        emailOtp: 'x6yd8ef',
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        username: 'username',
      },
    );
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Enter Security Code' }),
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

    await waitFor(() => {
      //Assert Password Reset Screen is visible
      expect(screen.getByText('Reset Your Password')).toBeVisible();
      // Assert the /submitMfa api was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/provideOtp',
        {
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          otp: 'some-code',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
          policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
          userToken: expect.anything(),
        },
      );
    });
  });
  it('User should see redirect to security page after success of resetting the password', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'PASSWORD_RESET_REQUIRED',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
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
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );
    //Assert to view Password Reset Screen
    expect(screen.getByText('Reset Your Password')).toBeVisible();
    const passwordEntryInput = screen.getByLabelText(/New Password/i, {
      selector: 'input',
    });
    const dateEntryInput = screen.getByRole('textbox', {
      name: 'Date of Birth (MM/DD/YYYY)',
    });

    //Input the DOB & Password Values
    await userEvent.type(dateEntryInput, '02282023');
    await userEvent.type(passwordEntryInput, 'Xyz@2020');
    //Mock the password reset api
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'MFA_Disabled',
          accessToken: 'ytafbafll-a6b6-fadfd-9b09-36b543aee90f',
          refreshToken:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
          idToken:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJzdWIiOiJiZGEwNTA0Ny02NjM1LTQ1Y2ItYjcyZ',
          interactionId: '00f39381-a6b6-4eca-9b09-36b543aee90f',
          interactionToken: '96f134d40d9c56e204871e47c88cc53ae4c1',
          sessionToken: '96f134d40d9c56e204871e47c88cc53ae4c1',
          email: 'xyz@xyz.com',
          userId: 'Testuser123',
        },
      } satisfies ESResponse<Partial<PasswordResetResponse>>,
    });
    //click reset password
    fireEvent.click(screen.getByText('Reset Password'));
    await waitFor(() => {
      //Assert the call to /paswordreset api
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/passwordReset',
        {
          newPassword: 'Xyz@2020',
          dateOfBirth: '2023-02-28',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          username: 'username',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        },
      );
      //Assert the user is taken to success screen
      expect(screen.getByText(/You've successfully reset your password./i));
    });
    fireEvent.click(screen.getByText('Continue'));
    await waitFor(() => {
      // Assert the user user is taken to dashboard
      expect(mockReplace).toHaveBeenCalledWith('/security');
    });
  });
});
