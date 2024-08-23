process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777818';
import { LoginResponse } from '@/app/login/models/api/login';
import LogIn from '@/app/login/page';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
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
}));

const setupUI = () => {
  render(<LogIn />);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};

describe('Multiple Login Attempts Error', () => {
  it('should render Multiple Login Attempts Error Messages', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i);
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'username');
    await userEvent.type(password, 'password');

    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          message: 'ACCOUNT_INACTIVE',
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

    fireEvent.click(btnLogIn);
    await waitFor(() => {
      expect(screen.getByLabelText(/Logging In.../i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication',
      {
        username: 'username',
        password: 'password',
      },
    );

    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        'You have attempted to log in too many times. Please wait 15 minutes to try again.',
      ),
    ).toBeVisible();
  });
});
