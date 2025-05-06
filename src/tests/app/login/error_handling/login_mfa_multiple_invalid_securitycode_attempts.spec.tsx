process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777818';
process.env.ES_API_POLICY_ID = 'policyId';
process.env.ES_API_APP_ID = 'appId';
import { LoginResponse } from '@/app/(protected)/(common)/member/login/models/api/login';
import { SelectMfaDeviceResponse } from '@/app/(protected)/(common)/member/login/models/api/select_mfa_device_response';
import LogIn from '@/app/(protected)/(common)/member/login/page';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

const setupUI = () => {
  return render(<LogIn />);
};

describe('Multiple Login MFA Invalid Secutity Code Attempts Error', () => {
  it('should render Multiple Login MFA Invalid Secutity Code with Error Messages', async () => {
    const { container } = setupUI();
    // Login Info Card

    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i, {
      selector: 'input',
    });
    const loginButton = screen.getByRole('button', {
      name: /Log In/i,
    });

    mockedAxios.post
      .mockResolvedValueOnce({
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
                deviceId: '9803c2fd-4238-44a7-828a-c0fa9ef34427',
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
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            deviceId: '9803c2fd-4238-44a7-828a-c0fa9ef34427',
            flowStatus: 'Done',
            interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
            interactionToken:
              '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          },
        } satisfies Partial<ESResponse<SelectMfaDeviceResponse>>,
      });

    await userEvent.type(inputUserName, 'username');
    await userEvent.type(password, 'password');

    // The input username field should have the value
    expect(inputUserName).toHaveValue('username');
    // The input password field should have the password
    expect(password).toHaveValue('password');

    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(screen.getByLabelText(/Logging In.../i)).toBeInTheDocument();
    });
    // Should call login post api with correct parameters
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication',
      {
        username: 'username',
        password: 'password',
        appId: 'appId',
        policyId: 'policyId',
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

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication/selectDevice',
        {
          deviceId: '9803c2fd-4238-44a7-828a-c0fa9ef34427',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
          policyId: 'policyId',
          appId: 'appId',
          userToken: expect.anything(),
        },
      );
    });

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

    // Enter the mfa code
    const mfaCodeEntry = screen.getByRole('textbox', {
      name: 'Enter Security Code',
    });
    await userEvent.type(mfaCodeEntry, '123456');

    expect(mfaCodeEntry).toHaveValue('123456');

    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {
          data: { errorCode: 'MF-405' },
        },
        status: 400,
      }),
    );

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
        interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
        interactionToken:
          '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',

        otp: '123456',
        appId: 'appId',
        policyId: 'policyId',
        userToken: expect.anything(),
      },
    );
    // Assert the loading indicator went off
    expect(screen.queryByLabelText(/Confirming/i)).not.toBeInTheDocument();

    expect(screen.getByText('Too Many Login Attempts')).toBeVisible();
    expect(
      screen.getByText(
        'You have tried the security code too many times. Please wait 10 minutes to try again.',
      ),
    ).toBeVisible();

    expect(screen.getByText('Need help?')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
