import LogInPage from '@/app/login/page';
import { initPingOne } from '@/app/pingOne/setupPingOne';
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
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

const setupUI = () => {
  render(<LogInPage />);
};

describe('Login API Error', () => {
  it('should render all the required components', async () => {
    setupUI();
    // Login Info Card
    const inputUserName = screen.getByRole('textbox', { name: /Username/i });
    const password = screen.getByLabelText(/password/i, {
      selector: 'input',
    });
    const btnLogIn = screen.getByRole('button', { name: /Log In/i });
    await userEvent.type(inputUserName, 'bcbstuser222');
    await userEvent.type(password, 'Th1sisagreatpassword!!');

    mockedAxios.post.mockRejectedValueOnce({});
    fireEvent.click(btnLogIn);

    // Should call the api with correct values
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/loginAuthentication',
        {
          username: 'bcbstuser222',
          password: 'Th1sisagreatpassword!!',
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
          ipAddress: '1',
          deviceProfile: 'Testing',
        },
      );
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
      // Verify that the `getData` method of the `_pingOneSignals` object on the global `window` has been called.
      expect(window._pingOneSignals.getData).toHaveBeenCalled();
    });
  });

  test('should call initSilent with correct arguments when initializing PingOne', async () => {
    initPingOne();
    expect(window._pingOneSignals.initSilent).toHaveBeenCalledWith({
      envId: 'DEV',
      universalDeviceIdentification: true,
    });
    expect(window._pingOneSignals.initSilent).toHaveBeenCalledTimes(1);
  });
});
