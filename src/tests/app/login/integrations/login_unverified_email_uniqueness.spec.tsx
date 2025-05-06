process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.NEXT_PUBLIC_PORTAL_URL = 'https://test.bcbst.com/';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/(protected)/(common)/member/login/models/api/login';
import { UpdateEmailResponse } from '@/app/(protected)/(common)/member/login/models/api/update_email_response';
import LogInPage from '@/app/(protected)/(common)/member/login/page';
import { useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
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
  useSearchParams() {
    return {
      get: jest.fn(),
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
  const inputPassword = screen.getByLabelText(/password/i, {
    selector: 'input',
  });
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};

describe('Log In User whose has duplicate email for unverified user', () => {
  afterEach(() => {
    resetToHome();
  });
  it('User should see update email screen when login with unverified user', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      // call to /login
      data: {
        data: {
          message: 'NEW_EMAIL_REQUIRED',
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

    //Login Email Verification screen should be visible
    await waitFor(() => {
      expect(
        screen.getByText(
          'You need to change your email, or the email was already associated with another account. Please enter a new email address below.',
        ),
      ).toBeVisible();
    });

    // Enter the email address
    const emailAddress = screen.getByRole('textbox', {
      name: 'Email Address',
    });
    await userEvent.type(emailAddress, 'abc@bcbst.com');
    const confirmEmailAddress = screen.getByRole('textbox', {
      name: 'Confirm Email Address',
    });
    await userEvent.type(confirmEmailAddress, 'abc@bcbst.com');
    mockedAxios.post.mockResolvedValueOnce({
      // call to /login
      data: {
        data: {
          message: 'EMAIL_VERIFICATION_REQUIRED',
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          emailId: 'abc@bcbst.com',
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
      } satisfies ESResponse<UpdateEmailResponse>,
    });
    // Click Next button
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => {
      userEvent.click(nextBtn);
    });

    // Assert the /updateEmail api was called correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/updateEmail',
        {
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',

          newEmail: 'abc@bcbst.com',
        },
      );
    });

    // The email verification code entry screen should be visible
    await waitFor(() => {
      expect(screen.getByText('a**@bcbst.com')).toBeVisible();
    });
    //Enter the Email verification code
    const emailVerficationCode = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(emailVerficationCode, 'some-code');

    // The code entry field should have correct value
    expect(emailVerficationCode).toHaveValue('some-code');
    mockedAxios.post.mockResolvedValueOnce({
      // call to /verifyUniqueEmailOtp
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
    // Click confirm button
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Code' });
    await userEvent.click(confirmBtn);
    // Assert the /verifyUniqueEmailOtp api was called correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/verifyUniqueEmailOtp',
        {
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          emailOtp: 'some-code',
          policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
          username: 'username',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        },
      );
    });

    // The mfa code entry screen should be visible
    await waitFor(() => {
      expect(screen.getByText('Enter Security Code')).toBeVisible();
    });
  });
});
