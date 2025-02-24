process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.NEXT_PUBLIC_PORTAL_URL = 'https://test.bcbst.com/';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/login/models/api/login';
import { UpdateEmailResponse } from '@/app/login/models/api/update_email_response';
import LogInPage from '@/app/login/page';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { ESResponse } from '@/models/enterprise/esResponse';
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
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

//jest.mock('../../../../../app/login/stores/verifyEmailStore');
jest.setTimeout(30000);

// Mock window.open
global.open = jest.fn();
const resetToHome = useLoginStore.getState().resetToHome;

const setupUI = () => {
  const component = render(<LogInPage />);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i, {
    selector: 'input',
  });
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { component, inputUsername, inputPassword, loginButton };
};

describe('Email Uniqueness resend code - Http Error 400', () => {
  afterEach(() => {
    resetToHome();
  });
  test('Email uniqueness resend code 400 http error code', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'NEW_EMAIL_REQUIRED',
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
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
    //Assert to view change email Screen
    expect(
      screen.getByText(
        'You need to change your email, or the email was already associated with another account. Please enter a new email address below.',
      ),
    ).toBeVisible();

    // Enter the email address
    const emailAddress = screen.getByRole('textbox', {
      name: 'Email Address',
    });
    await userEvent.type(emailAddress, 'abc@bcbst.com');
    const confirmEmailAddress = screen.getByRole('textbox', {
      name: 'Confirm Email Address',
    });
    await userEvent.type(confirmEmailAddress, 'abc@bcbst.com');
    mockedAxios.post
      .mockResolvedValueOnce({
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
      })
      .mockRejectedValueOnce(
        createAxiosErrorForTest({
          errorObject: {},
          status: 400,
        }),
      );
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

    const resendCodeLink = screen.getByText('Resend Code');
    fireEvent.click(resendCodeLink);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/resendOtp',
        {
          interactionId: 'interactionId1',
          interactionToken: 'interactionToken1',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        },
      );
    });

    // Assert the error message is displayed for INVALID_OTP
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "Oops! We're sorry. Something went wrong. Please try again.",
      ),
    ).toBeVisible();
    expect(ui.component.baseElement).toMatchSnapshot();
  });
});
