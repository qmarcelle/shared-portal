process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';

import { LoginResponse } from '@/app/login/models/api/login';
import LogInPage from '@/app/login/page';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
      refresh: mockRefresh,
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

describe('PBE Service Error in Primary Account Selection', () => {
  afterEach(() => {
    resetToHome();
  });

  it('User should see Loading error screen and the login is not successfull', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Duplicate_Account',
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

    // Check the checkbox to enable the button
    fireEvent.click(screen.getByRole('checkbox'));
    // Ensure the mockedAxios.get call is made after the button click
    await waitFor(() => {
      fireEvent.click(screen.getByText('Continue With This Username'));
    });
    mockedFetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith(
        'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=username&isPBERequired=true&isConsentRequired=true',
        {
          cache: undefined,
          headers: { Authorization: 'Bearer BearerTokenMockedValue' },
          next: { revalidate: 1800, tags: ['username'] },
        },
      );
    });
  });
});
