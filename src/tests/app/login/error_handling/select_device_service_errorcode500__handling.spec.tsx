process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/login/models/api/login';
import LogInPage from '@/app/login/page';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
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

describe('Select Device Service Errors', () => {
  test('Select Device Service ErrorCode 500 error', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'DEVICE_SELECTION_REQUIRED',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          mfaDeviceList: [
            {
              deviceType: 'SMS',
              deviceId: '9803c2fd-1106-44a7-828a-c0fa9ef34427',
              deviceStatus: 'ACTIVE',
              createdAt: '2024-04-29T12:52:29.385Z',
              updatedAt: '2024-04-29T12:53:27.821Z',
              phone: '+1.4232220222',
            },
            {
              deviceType: 'TOTP',
              deviceId: '9803c2fd-3454-44a7-828a-c0fa9ef34427',
              deviceStatus: 'ACTIVE',
              createdAt: '2024-04-29T12:52:29.385Z',
              updatedAt: '2024-04-29T12:53:27.821Z',
              phone: '+1.4232220222',
            },
            {
              deviceType: 'VOICE',
              deviceId: '9803c2fd-4234-44a7-828a-c0fa9ef34427',
              deviceStatus: 'ACTIVE',
              createdAt: '2024-04-29T12:52:29.385Z',
              updatedAt: '2024-04-29T12:53:27.821Z',
              phone: '+1.4232220222',
            },
            {
              deviceType: 'EMAIL',
              deviceId: '9803c2fd-4234-44a7-828a-c0fa9ef34427',
              deviceStatus: 'ACTIVE',
              createdAt: '2024-04-29T12:52:29.385Z',
              updatedAt: '2024-04-29T12:53:27.821Z',
              email: 'utsavi_oza@bcbst.com',
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
    // The loading progress should be out now and not vivible
    expect(screen.queryByLabelText(/Logging In.../i)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByRole('radio', {
          name: 'Email a code to u*********@bcbst.com',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: 'Use an Authenticator App' }),
      ).toBeInTheDocument();
    });

    const textToNumberRadio = screen.getByRole('radio', {
      name: 'Email a code to u*********@bcbst.com',
    });
    const sendMfaButton = screen.getByRole('button', {
      name: /send code/i,
    });
    await userEvent.click(textToNumberRadio);
    await userEvent.click(sendMfaButton);
    expect(screen.queryByLabelText(/Sending Code.../i)).not.toBeInTheDocument();

    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/selectDevice',
        {
          deviceId: '9803c2fd-4234-44a7-828a-c0fa9ef34427',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
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
