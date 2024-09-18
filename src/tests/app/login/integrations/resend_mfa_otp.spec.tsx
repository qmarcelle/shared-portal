process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';
import { LoginResponse } from '@/app/login/models/api/login';
import { SelectMfaDeviceResponse } from '@/app/login/models/api/select_mfa_device_response';
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

jest.mock('next/headers', () => {
  return {
    headers: (): Headers => {
      return {
        get: (headerName: string): string | undefined => {
          // Return the mocked value based on the header name
          if (headerName === 'x-forwarded-for') {
            return '1';
          }
          return undefined;
        },
      } as Headers;
    },
  };
});

jest.mock('next/server', () => ({
  userAgent: jest.fn(() => ({
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent
  })),
}));

jest.mock('../../../../app/pingOne/setupPingOne', () => ({
  getPingOneData: jest.fn().mockResolvedValue('Testing'), // Mock the return value as a string
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

describe('Resend Mfa Code', () => {
  test('should render all required elements correctly', () => {
    const { inputUsername, inputPassword, loginButton } = setupUI();

    expect(inputUsername).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('should call correct apis for resending otp', async () => {
    //const mockAxios = mock<Axios>()
    mockedAxios.post
      .mockResolvedValueOnce({
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
        data: {
          data: {
            deviceId: 'sdasdad',
            flowStatus: 'Done',
            interactionId: 'interactionId2',
            interactionToken: 'interactionToken2',
          },
        } satisfies Partial<ESResponse<SelectMfaDeviceResponse>>,
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            message: 'DEVICE_SELECTION_REQUIRED',
            interactionId: 'interactionId3',
            interactionToken: 'interactionToken3',
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
        data: {
          data: {
            deviceId: 'sdasdad',
            flowStatus: 'Done',
            interactionId: 'interactionId4',
            interactionToken: 'interactionToken4',
          },
        } satisfies Partial<ESResponse<SelectMfaDeviceResponse>>,
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
        screen.getByRole('radio', {
          name: 'Text a code to (***)***-0222',
        }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('radio', {
          name: 'Email a code to s*******************@bcbst.com',
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: 'Use an Authenticator App' }),
      ).toBeInTheDocument();
    });

    const textToNumberRadio = screen.getByRole('radio', {
      name: 'Text a code to (***)***-0222',
    });
    const sendMfaButton = screen.getByRole('button', {
      name: /send code/i,
    });
    await userEvent.click(textToNumberRadio);
    await userEvent.click(sendMfaButton);
    expect(screen.queryByLabelText(/Sending Code.../i)).not.toBeInTheDocument();

    // Mfa Security must be called
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

    const resendButton = screen.getByText('Resend Code');
    userEvent.click(resendButton);

    await waitFor(() => {
      // 1. Login 2. Device Selection 3. Login -> 4. Device Selection called when selected
      expect(mockedAxios.post).toHaveBeenCalledTimes(4);
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        3,
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

      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        4,
        '/mfAuthentication/loginAuthentication/selectDevice',
        {
          appId:
            '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
          deviceId: '9803c2fd-1106-44a7-828a-c0fa9ef34427',
          interactionId: 'interactionId3',
          interactionToken: 'interactionToken3',
          policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        },
      );
    });

    // The UI should remain same.
    expect(
      screen.getByRole('textbox', { name: 'Enter Security Code' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Code resent!')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Choose a Different Method',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'contact us' }),
    ).toBeInTheDocument();
  });
});
